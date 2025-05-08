"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"

interface PaymentReceiptProps {
  paymentId: string
  orderId: string
  amount: number
  date: Date
  description: string
  username: string
  email: string
  subscriptionType?: string
}

export function PaymentReceipt({
  paymentId,
  orderId,
  amount,
  date,
  description,
  username,
  email,
  subscriptionType,
}: PaymentReceiptProps) {
  const [isOpen, setIsOpen] = useState(false)

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handlePrint = () => {
    const printContent = document.getElementById("receipt-content")
    const windowPrint = window.open("", "", "width=900,height=650")

    if (printContent && windowPrint) {
      windowPrint.document.write(`
        <html>
          <head>
            <title>Resify - Payment Receipt</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .receipt { max-width: 800px; margin: 0 auto; padding: 20px; border: 2px solid #000; }
              .header { text-align: center; margin-bottom: 20px; }
              .logo { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
              .title { font-size: 18px; margin-bottom: 20px; }
              .details { margin-bottom: 20px; }
              .row { display: flex; margin-bottom: 10px; }
              .label { width: 150px; font-weight: bold; }
              .value { flex: 1; }
              .amount { text-align: right; font-size: 18px; font-weight: bold; margin-top: 20px; }
              .footer { margin-top: 40px; text-align: center; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="receipt">
              <div class="header">
                <div class="logo">Resify</div>
                <div class="title">Payment Receipt</div>
              </div>
              <div class="details">
                <div class="row">
                  <div class="label">Receipt No:</div>
                  <div class="value">${paymentId}</div>
                </div>
                <div class="row">
                  <div class="label">Order ID:</div>
                  <div class="value">${orderId}</div>
                </div>
                <div class="row">
                  <div class="label">Date:</div>
                  <div class="value">${formatDate(date)}</div>
                </div>
                <div class="row">
                  <div class="label">Customer:</div>
                  <div class="value">${username}</div>
                </div>
                <div class="row">
                  <div class="label">Email:</div>
                  <div class="value">${email}</div>
                </div>
                <div class="row">
                  <div class="label">Description:</div>
                  <div class="value">${description}</div>
                </div>
              </div>
              <div class="amount">
                Amount Paid: ₹${amount.toFixed(2)}
              </div>
              <div class="footer">
                Thank you for using Resify! This is a computer-generated receipt and does not require a signature.
              </div>
            </div>
          </body>
        </html>
      `)
      windowPrint.document.close()
      windowPrint.focus()
      windowPrint.print()
      windowPrint.close()
    }
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        View Receipt
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-cartoon">Payment Receipt</DialogTitle>
          </DialogHeader>

          <div id="receipt-content" className="p-6 border-2 border-black rounded-lg bg-white">
            <div className="text-center mb-6">
              <h2 className="font-cartoon text-2xl">Resify</h2>
              <p className="text-gray-500">AI-Powered Document Analysis</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Receipt No</p>
                <p className="font-medium">{paymentId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{formatDate(date)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-medium">{orderId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Customer</p>
                <p className="font-medium">{username}</p>
              </div>
            </div>

            <div className="border-t border-b border-gray-200 py-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="font-medium">{description}</span>
                <span>
                  ₹{amount.toFixed(2)}
                  {subscriptionType ? "/month" : ""}
                </span>
              </div>
              {subscriptionType && (
                <div className="text-sm text-gray-600 mt-2">
                  <p>Subscription Type: {subscriptionType.charAt(0).toUpperCase() + subscriptionType.slice(1)}</p>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-medium">Total</span>
              <span className="text-xl font-bold">₹{amount.toFixed(2)}</span>
            </div>

            <div className="text-center text-sm text-gray-500 mt-8">
              <p>Thank you for using Resify!</p>
              <p>This is a computer-generated receipt and does not require a signature.</p>
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-4">
            <Button onClick={handlePrint} className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Print Receipt
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
