import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TextField,
  MenuItem,
} from "@mui/material";
import axios from "axios";

export default function ExchangeRates() {
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [rates, setRates] = useState(null);
  const [allCurrencies, setAllCurrencies] = useState([]);

  const fetchRates = async (base) => {
    try {
      const res = await axios.get(
        `https://api.exchangerate-api.com/v4/latest/${base}`
      );
      setRates(res.data.rates);
      setAllCurrencies(Object.keys(res.data.rates));
    } catch (err) {
      console.error("Error fetching exchange rates:", err);
    }
  };

  useEffect(() => {
    fetchRates(baseCurrency);
  }, [baseCurrency]);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Live Exchange Rates
      </Typography>

      <TextField
        select
        label="Base Currency"
        value={baseCurrency}
        onChange={(e) => setBaseCurrency(e.target.value)}
        sx={{ mb: 2, width: 200 }}
      >
        {allCurrencies.map((currency) => (
          <MenuItem key={currency} value={currency}>
            {currency}
          </MenuItem>
        ))}
      </TextField>

      {rates ? (
        <Paper sx={{ maxHeight: 400, overflow: "auto" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Currency</b>
                </TableCell>
                <TableCell>
                  <b>Rate (Base: {baseCurrency})</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(rates).map(([currency, rate]) => (
                <TableRow key={currency}>
                  <TableCell>{currency}</TableCell>
                  <TableCell>{rate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      ) : (
        <Typography>Loading exchange rates...</Typography>
      )}
    </Box>
  );
}
