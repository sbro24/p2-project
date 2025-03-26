
import pandas as pd
import numpy as np
from datetime import datetime
import os
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.stattools import adfuller

def adf_test(data):
    #print(data['value'])
    result = adfuller(data['value'])
    if result[1] <= 0.05:
        return True
    else:
        return False

def get_forecast(data, steps, d):
    start_params = [0.1, 0.05, 0.1, 1.0]
    if d == 0:
        start_params = [0.1, 0.05, 0.1, 0.0, 1.0]
    model = ARIMA(data, order=(2, d, 1))
    fitted_model = model.fit(start_params=start_params)
    forecast = fitted_model.forecast(steps=steps)
    return forecast

def get_data():
    file = f'{os.getcwd()}\\test_data\\test data.csv'
    with open(file, 'r', encoding='utf-8-sig') as f:        
        df = pd.read_csv(f, delimiter=';', encoding='utf-8-sig', header=0)
        return df
    
def get_diff_degree(data):
    d=0
    while adf_test(data)==False:
        data = data.diff.dropna()
        d+=1
    return d

def main():
    df = get_data()
    df.set_index('date', inplace=True)
    df.index = pd.DatetimeIndex(df.index).to_period('M')
    d = get_diff_degree(df)
    forecast = get_forecast(df, 12, d)
    print(forecast)

main()

