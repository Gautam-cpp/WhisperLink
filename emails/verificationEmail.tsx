import React from "react";
import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{ url: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap", format: 'woff2' }}
        />
      </Head>
      <Preview>Your verification code is {otp}</Preview>
      <Section style={{ backgroundColor: "#f9f9f9", padding: "20px" }}>
        <Row style={{ textAlign: "center" }}>
          <Heading style={{ fontFamily: "Roboto, Arial, sans-serif", color: "#333" }}>
            Account Verification Code
          </Heading>
          <Text style={{ fontFamily: "Roboto, Arial, sans-serif", color: "#555", margin: "10px 0" }}>
            Dear {username},
          </Text>
          <Text style={{ fontFamily: "Roboto, Arial, sans-serif", color: "#555", margin: "10px 0" }}>
            We are sending you this email to confirm your recent request to verify your account. Please find your one-time verification code below. This code will expire in 10 minutes.
          </Text>
          <Button
            href="#"
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              padding: "10px 20px",
              textDecoration: "none",
              borderRadius: "5px",
              fontFamily: "Roboto, Arial, sans-serif",
            }}
          >
            {otp}
          </Button>
          <Text style={{ fontFamily: "Roboto, Arial, sans-serif", color: "#555", marginTop: "20px" }}>
            If you did not request this action, please disregard this email or contact our support team if you have any concerns.
          </Text>
          <Text style={{ fontFamily: "Roboto, Arial, sans-serif", color: "#555", marginTop: "20px" }}>
            Sincerely,<br />The Support Team
          </Text>
        </Row>
      </Section>
    </Html>
  );
}
