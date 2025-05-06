// About.jsx
import React from "react";
import { Typography, Container, Box } from "@mui/material";

export default function About() {
  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ fontWeight: "bold", textAlign: "center" }}
      >
        About This App
      </Typography>
      <Typography variant="body1" sx={{ fontSize: "1.1rem", mt: 2 }}>
        This Loan Calculator App is a modern, single-page web application built
        using <strong>React JS</strong> and <strong>Material UI</strong>. It
        allows users to calculate loan EMIs (Equated Monthly Installments), view
        a detailed amortization schedule, and see real-time currency conversions
        of their EMI using live exchange rates.
      </Typography>
    </Container>
  );
}
