import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import axios from "axios";

const Home = () => {
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [term, setTerm] = useState("");
  const [emi, setEmi] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [currency, setCurrency] = useState("USD");
  const [rates, setRates] = useState({});
  const [convertedEmi, setConvertedEmi] = useState(null);
  const [convertedSchedule, setConvertedSchedule] = useState([]);
  const [calculated, setCalculated] = useState(false); // NEW FLAG

  useEffect(() => {
    axios
      .get("https://api.exchangerate-api.com/v4/latest/USD")
      .then((response) => setRates(response.data.rates))
      .catch((error) => console.error("Error fetching exchange rates", error));
  }, []);

  const calculateEMI = () => {
    const principal = parseFloat(loanAmount);
    const annualInterest = parseFloat(interestRate);
    const tenureMonths = parseInt(term) * 12;

    if (!principal || !annualInterest || !tenureMonths) {
      alert("Please enter valid loan details.");
      return;
    }

    const monthlyInterest = annualInterest / 12 / 100;
    const emiCalc =
      (principal *
        monthlyInterest *
        Math.pow(1 + monthlyInterest, tenureMonths)) /
      (Math.pow(1 + monthlyInterest, tenureMonths) - 1);

    const scheduleTemp = [];
    let balance = principal;

    for (let i = 1; i <= tenureMonths; i++) {
      const interest = balance * monthlyInterest;
      const principalPaid = emiCalc - interest;
      balance -= principalPaid;

      scheduleTemp.push({
        month: i,
        principal: principalPaid.toFixed(2),
        interest: interest.toFixed(2),
        balance: Math.max(balance, 0).toFixed(2),
      });
    }

    setEmi(emiCalc.toFixed(2));
    setSchedule(scheduleTemp);
    convertCurrency(emiCalc, scheduleTemp);
    setCalculated(true); // SET FLAG TRUE
  };

  const convertCurrency = (emiValue, scheduleValue) => {
    if (!rates || !rates[currency]) {
      alert("Exchange rates not loaded yet. Please try again later.");
      return;
    }

    const rate = rates[currency];
    setConvertedEmi((emiValue * rate).toFixed(2));

    const converted = scheduleValue.map((item) => ({
      ...item,
      principal: (item.principal * rate).toFixed(2),
      interest: (item.interest * rate).toFixed(2),
      balance: (item.balance * rate).toFixed(2),
    }));
    setConvertedSchedule(converted);
  };

  const handleReset = () => {
    setLoanAmount("");
    setInterestRate("");
    setTerm("");
    setEmi(null);
    setConvertedEmi(null);
    setSchedule([]);
    setConvertedSchedule([]);
    setCalculated(false); // RESET FLAG
  };

  return (
    <div style={{ padding: "30px" }}>
      <Typography variant="h4" gutterBottom>
        Loan Calculator Dashboard
      </Typography>

      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <TextField
          label="Loan Amount"
          variant="outlined"
          value={loanAmount}
          onChange={(e) => setLoanAmount(e.target.value)}
        />
        <TextField
          label="Interest Rate (%)"
          variant="outlined"
          value={interestRate}
          onChange={(e) => setInterestRate(e.target.value)}
        />
        <TextField
          label="Term (Years)"
          variant="outlined"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
      </div>

      <Button variant="contained" onClick={calculateEMI}>
        CALCULATE
      </Button>

      {calculated && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: 20,
            gap: 20,
          }}
        >
          <TextField
            select
            label="Currency"
            value={currency}
            onChange={(e) => {
              setCurrency(e.target.value);
              convertCurrency(emi, schedule);
            }}
            style={{ width: 120 }}
          >
            {Object.keys(rates).map((curr) => (
              <MenuItem key={curr} value={curr}>
                {curr}
              </MenuItem>
            ))}
          </TextField>

          <Button
            variant="outlined"
            style={{ color: "purple", borderColor: "purple" }}
            onClick={handleReset}
          >
            RESET TABLE
          </Button>
        </div>
      )}

      {convertedEmi && (
        <Typography variant="h6" style={{ marginTop: 20 }}>
          Monthly EMI: {currency === "USD" ? "$" : ""}
          {convertedEmi} {currency}
        </Typography>
      )}

      {convertedSchedule.length > 0 && (
        <Paper elevation={3} style={{ marginTop: 30, padding: 10 }}>
          <Typography variant="h6" gutterBottom>
            Amortization Schedule ({currency})
          </Typography>
          <div style={{ maxHeight: 400, overflowY: "auto" }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Month</TableCell>
                  <TableCell>Principal</TableCell>
                  <TableCell>Interest</TableCell>
                  <TableCell>Remaining Balance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {convertedSchedule.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.month}</TableCell>
                    <TableCell>
                      {item.principal} {currency}
                    </TableCell>
                    <TableCell>
                      {item.interest} {currency}
                    </TableCell>
                    <TableCell>
                      {item.balance} {currency}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Paper>
      )}
    </div>
  );
};

export default Home;
