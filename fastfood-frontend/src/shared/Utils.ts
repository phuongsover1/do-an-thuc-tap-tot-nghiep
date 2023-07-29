export const handleMoney = (money: number) => {
  let total = '';
  const moneyString = String(money);
  let temp = '';
  for (let i = moneyString.length - 1; i >= 0; --i) {
    temp = moneyString[i] + temp;
    if (temp.length === 3) {
      if (i !== 0) {
        temp = '.' + temp;
      }
      total = temp + total;
      temp = '';
    }
  }
  total = temp + total;
  return total;
};
