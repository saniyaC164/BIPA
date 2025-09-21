import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

df = pd.read_csv("BACKEND/transactions.csv", sep=";")
print(df.head())

plt.bar(df["product_category"], df["Amount"])
plt.xlabel("Category")
plt.ylabel("Amount")
plt.title("Transaction Amounts by Category")
plt.xticks(rotation=45)
plt.tight_layout()
plt.show()