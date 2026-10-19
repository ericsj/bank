-- safety agaist application code bugs: refuses negative balance and transfer with negative or zero value
ALTER TABLE "Account" ADD CONSTRAINT "Account_balance_non_negative" CHECK ("balance" >= 0);
ALTER TABLE "Transfer" ADD CONSTRAINT "Transfer_amount_negative" CHECK ("amount" > 0);