import pandas as pd
import sys
labels = '''SR NO.	Roll No.	Enrollment No.	Student Name	Date of Birth	Register No.	Parent Id	Parent's Contact No	Status'''
labels = str.split(labels,'	')
tb = pd.read_html('./rep.xls')[1]
g = tb[0]
tb = tb[1:]
tb.columns = labels
tb['Roll No.'] = tb['Roll No.'].astype(int)
tb['Enrollment No.'] = tb['Enrollment No.'].astype(int)
tb = tb.drop(columns=['Date of Birth', 'Parent Id','Date of Birth','Parent\'s Contact No','Status','SR NO.','Register No.'])
tb.to_csv('./6A.csv')
tb.to_excel('./6A.xlsx')
tb
