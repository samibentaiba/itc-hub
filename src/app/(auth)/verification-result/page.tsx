// src/app/(auth)/verification-result/page.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function VerificationResultPage() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const message = searchParams.get("message");

  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (success === "true") {
      setIsSuccess(true);
    }
  }, [success]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', textAlign: 'center', padding: '20px' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: isSuccess ? 'green' : 'red' }}>
        {isSuccess ? "Verification Successful" : "Verification Failed"}
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
        {message || (isSuccess ? "Your email has been successfully verified." : "Something went wrong during the verification process.")}
      </p>
      {isSuccess ? (
        <Link href="/login" style={{ padding: '10px 20px', backgroundColor: 'blue', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
          Go to Login
        </Link>
      ) : (
        <Link href="/register" style={{ padding: '10px 20px', backgroundColor: 'blue', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
          Go to Register
        </Link>
      )}
    </div>
  );
}
