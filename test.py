from __future__ import print_function
import warnings
warnings.filterwarnings("ignore")
import ee
import datetime
from dateutil import relativedelta
import time
import itertools
import numpy as np
import matplotlib.pyplot as plt
import statsmodels.api as sm
plt.style.use('fivethirtyeight')
import matplotlib
import matplotlib.dates as mdates
from pylab import rcParams
import pandas as pd
import io
import sys
import random

def eprint(*args, **kwargs):
    print(*args, file=sys.stderr, **kwargs)


rcParams['figure.figsize'] = 18, 8

matplotlib.rcParams['axes.labelsize'] = 14
matplotlib.rcParams['xtick.labelsize'] = 12
matplotlib.rcParams['ytick.labelsize'] = 12
matplotlib.rcParams['text.color'] = 'k'




    

