import pandas as pd
import os
import numpy as np
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.stattools import adfuller, acf, pacf
import argparse
import json
from math import ceil

class ArimaForecast():

    # Initializes the values for the object
    def __init__(self, path=None, steps=12, id=None):
        if not path:
            raise ValueError("A valid path to the JSON file must be provided.")
        self.path = path
        self.steps = steps
        self.id = id
        self.data = self.get_data()
        self.get_diff_degree()

    ### NOT IMPLEMENTED ###
    def calculate_acf(data, nlags=40):
        acf_values = acf(data['value'], nlags=nlags, fft=True)
        return acf_values

    ### NOT IMPLEMENTED ###
    def calculate_pacf(data, nlags=40):
        pacf_values = pacf(data['value'], nlags=nlags, method='ywunbiased')
        return pacf_values
    
            #iterates over the adf test, differentiating a data copy, until the adf test returns True and ARIMA value 'd' is found
    def get_diff_degree(self):
        for a in self.data:
            d=0
            data = self.data[a]["numbers"]
            while self.adf_test(data)==False:
                data = data.diff().dropna()
                d+=1
            self.data[a]["d"] = d

    # Runs the adf test, returning True/False depending on the result
    def adf_test(self, data):    
        result = adfuller(data)
        if result[1] <= 0.05:
            return True
        else:
            return False

    # Generates the forecast, using the ARIMA model
    def get_forecast(self):
        forecastdata = { 
        "revenue": {}, #{"2025": [16800, 19950, 23100, 27300, 30450, 35700, 32550, 31500, 29400, 25200, 22050, 18900]},
        "expenses": {} #{"2025": [10500, 11550, 12600, 13650, 14700, 17850, 16800, 15750, 14700, 13650, 12600, 11550]}
        }

        """start_params = [0.1, 0.05, 0.1, 1.0]
        if self.d == 0:
            start_params = [0.1, 0.05, 0.1, 0.0, 1.0]"""
        
        for key in self.data:
            model = ARIMA(self.data[key]["numbers"], order=(2, self.data[key]["d"], 1)) # needs p and q functions
            fitted_model = model.fit() #start_params=start_params
            forecast = fitted_model.forecast(steps=self.steps)
            forecast_values = [int(value) for value in forecast.values.tolist()]
            print(forecast)
            forecastdata[key][f"{str(forecast.index[0]).split('-')[0]}"] = forecast_values
        return forecastdata
    
    # Loads and formats data to a workable shape
    def get_data(self):      
        data = {
            "revenue": {"numbers": None, "p": None, "d": None, "q": None},
            "expenses": {"numbers": None, "p": None, "d": None, "q": None}
        }
        
        f = open(self.path, 'r', encoding='utf-8-sig')       
        ds = json.load(f)
        for a in ds:
            if self.id == a["companyId"]:
                dict = a
        f.close
        for key in data:
            #instantiate values
            value_array = []
            year_array = []
            index_array =[]
            for a in dict["data"]["result"][key]:
                year_array.append(a)
                value_array = value_array + dict["data"]["result"][key][a]
            month = 0
            year = 0
            # format data
            for a in value_array:
                month += 1
                index_array.append(f"{year_array[year]}-{month}")
                if month == 12:
                    year += 1
                    month = 0
            series = pd.Series(value_array, index=pd.DatetimeIndex(index_array).to_period('M'), name = f'{key}')
            data[key]["numbers"]=series
        return data
    
    def upload_json(self, forecastdata, id):
        with open(self.path, 'r', encoding='utf-8-sig') as f:    
            ds = json.load(f)
            count = 0
            for a in ds:
                if id in ds[count]:
                    for key in forecastdata:
                        ds[count]["data"]["forecast"][key] = forecastdata[key]
                else:
                    count +=1
            f.close
            with open(self.path, 'w', encoding='utf-8-sig') as f:    
                json.dump(ds, f, ensure_ascii=False, indent=2)
                f.close

# a standard python convention
if __name__ == "__main__":

    # an argument parser, allowing the script to be run with parameters
    parser = argparse.ArgumentParser(description="ARIMA model forecasting script.")
    parser.add_argument("--company", type=int, default=None, help="Identifier for working company.")
    parser.add_argument("--steps", type=int, default=12, help="Number of steps to forecast into the future.")
    parser.add_argument("--path", type=str, default=f'{os.getcwd()}\\assets\\Database\\financialMetrics.json', help="Path to the JSON file containing the time series data.")
    args = parser.parse_args()

    steps = args.steps
    path = args.path
    company = args.company

   
    """ 
    path = f'{os.getcwd()}\\p2-project\\assets\\Database\\financialMetrics2.json'
    steps = 12
    company = 1
    """
    

    # main
    m = ArimaForecast(path=path, steps=steps, id=company)
    forecast = m.get_forecast()
    m.upload_json(forecast, company)




















"""

In start_params, we can set the initial values for the ARIMA model parameters:
- AR Coefficients
- MA Coefficients
- Variance

Use Statistical Heuristics:
AR Coefficients: Use the autocorrelation function (ACF) or partial autocorrelation function (PACF) of the data to estimate the AR coefficients.
MA Coefficients: Use the ACF to estimate the MA coefficients.
Variance: Use the variance of the residuals or the data as an initial guess for the error variance.

The start_params parameter in the fit method of the ARIMA model is an initial guess for the parameters of the model.
These parameters are used as the starting point for the optimization process that estimates the best-fitting model parameters.
Choosing appropriate start_params can help the optimization converge faster and avoid issues like non-convergence or poor local minima.

For ARIMA models, the start_params array typically includes:
AR coefficients (one for each lag in the AR component).
MA coefficients (one for each lag in the MA component).
Intercept or constant term (if applicable).
Variance of the residuals.

Set default parameters for ARIMA model:
- AR coefficients: [0.1, 0.05] (for AR(2) model)
- MA coefficients: [0.1] (for MA(1) model)
- Variance: [1.0] (initial guess for variance of residuals)


Another idea is to use multiprocessing with random start_params to find the best parameters for the ARIMA model.
By fitting until there are no issues with convergence or local minima.


"""

