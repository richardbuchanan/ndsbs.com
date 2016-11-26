Table 12 Response Reason Codes and Response Reason Text
Response
Code
Response
Reason
Code
Response Reason Text Notes
1 1 This transaction has been approved.
2 2 This transaction has been declined.
2 3 This transaction has been declined.
2 4 This transaction has been declined. The code returned from the processor
indicating that the card used needs to be
picked up.
3 5 A valid amount is required. The value submitted in the amount field
did not pass validation for a number.
3 6 The credit card number is invalid.
3 7 The credit card expiration date is invalid. The format of the date submitted was
incorrect.
3 8 The credit card has expired.
3 9 The ABA code is invalid. The value submitted in the x_bank_aba_
code field did not pass validation or was
not for a valid financial institution.
3 10 The account number is invalid. The value submitted in the x_bank_acct_
num field did not pass validation.
3 11 A duplicate transaction has been
submitted.
A transaction with identical amount and
credit card information was submitted
two minutes prior.
3 12 An authorization code is required but not
present.
A transaction that required x_auth_code
to be present was submitted without a
value.
3 13 The merchant API Login ID is invalid or
the account is inactive.
3 14 The Referrer or Relay Response URL is
invalid.
The Relay Response or Referrer URL
does not match the merchant’s
configured value(s) or is absent.
Applicable only to SIM and WebLink
APIs.
3 15 The transaction ID is invalid. The transaction ID value is non-numeric
or was not present for a transaction that
requires it (i.e., VOID, PRIOR_AUTH_
CAPTURE, and CREDIT).
3 16 The transaction was not found. The transaction ID sent in was properly
formatted but the gateway had no record
of the transaction.
3 17 The merchant does not accept this type
of credit card.
The merchant was not configured to
accept the credit card submitted in the
transaction.
Transaction Details Guide | July 2015 47
Appendix B Reason Response Codes
3 18 ACH transactions are not accepted by
this merchant.
The merchant does not accept electronic
checks.
3 19 - 23 An error occurred during processing.
Please try again in 5 minutes.
3 24 The Nova Bank Number or Terminal ID
is incorrect. Call Merchant Service
Provider.
3 25 - 26 An error occurred during processing.
Please try again in 5 minutes.
2 27 The transaction resulted in an AVS
mismatch. The address provided does
not match billing address of cardholder.
2 28 The merchant does not accept this type
of credit card.
The Merchant ID at the processor was
not configured to accept this card type.
2 29 The Paymentech identification numbers
are incorrect. Call Merchant Service
Provider.
2 30 The configuration with the processor is
invalid. Call Merchant Service Provider.
2 31 The FDC Merchant ID or Terminal ID is
incorrect. Call Merchant Service
Provider.
The merchant was incorrectly set up at
the processor.
3 32 This reason code is reserved or not
applicable to this API.
3 33 FIELD cannot be left blank. The word FIELD represents an actual
field name. This error indicates that a
field the merchant specified as required
was not filled in. Please see the Form
Fields section of the Merchant
Integration Guide for details.
2 34 The VITAL identification numbers are
incorrect. Call Merchant Service
Provider.
The merchant was incorrectly set up at
the processor.
2 35 An error occurred during processing.
Call Merchant Service Provider.
The merchant was incorrectly set up at
the processor.
3 36 The authorization was approved, but
settlement failed.
2 37 The credit card number is invalid.
2 38 The Global Payment System
identification numbers are incorrect. Call
Merchant Service Provider.
The merchant was incorrectly set up at
the processor.
Table 12 Response Reason Codes and Response Reason Text (Continued)
Response
Code
Response
Reason
Code
Response Reason Text Notes
Transaction Details Guide | July 2015 48
Appendix B Reason Response Codes
3 40 This transaction must be encrypted.
2 41 This transaction has been declined. Only merchants set up for the
FraudScreen.Net service would receive
this decline. This code will be returned if
a given transaction’s fraud score is
higher than the threshold set by the
merchant.
3 43 The merchant was incorrectly set up at
the processor. Call your Merchant
Service Provider.
The merchant was incorrectly set up at
the processor.
2 44 This transaction has been declined. The card code submitted with the
transaction did not match the card code
on file at the card issuing bank and the
transaction was declined.
2 45 This transaction has been declined. This error would be returned if the
transaction received a code from the
processor that matched the rejection
criteria set by the merchant for both the
AVS and Card Code filters.
3 46 Your session has expired or does not
exist. You must log in to continue
working.
3 47 The amount requested for settlement
may not be greater than the original
amount authorized.
This occurs if the merchant tries to
capture funds greater than the amount of
the original authorization-only
transaction.
3 48 This processor does not accept partial
reversals.
The merchant attempted to settle for less
than the originally authorized amount.
3 49 A transaction amount greater than
$[amount] will not be accepted.
The transaction amount submitted was
greater than the maximum amount
allowed.
3 50 This transaction is awaiting settlement
and cannot be refunded.
Credits or refunds can only be performed
against settled transactions. The
transaction against which the credit/
refund was submitted has not been
settled, so a credit cannot be issued.
3 51 The sum of all credits against this
transaction is greater than the original
transaction amount.
3 52 The transaction was authorized, but the
client could not be notified; the
transaction will not be settled.
Table 12 Response Reason Codes and Response Reason Text (Continued)
Response
Code
Response
Reason
Code
Response Reason Text Notes
Transaction Details Guide | July 2015 49
Appendix B Reason Response Codes
3 53 The transaction type was invalid for
ACH transactions.
If x_method = ECHECK, x_type cannot
be set to CAPTURE_ONLY.
3 54 The referenced transaction does not
meet the criteria for issuing a credit.
3 55 The sum of credits against the
referenced transaction would exceed
the original debit amount.
The transaction is rejected if the sum of
this credit and prior credits exceeds the
original debit amount
3 56 This merchant accepts ACH
transactions only; no credit card
transactions are accepted.
The merchant processes eCheck.Net
transactions only and does not accept
credit cards.
3 57 - 63 An error occurred in processing. Please
try again in 5 minutes.
2 65 This transaction has been declined. Authorization with the card issuer was
successful, but the transaction was
declined due to a card code mismatch
with the card code on file with the card
issuing bank. This is based on the
settings in the Merchant Interface.
3 66 This transaction cannot be accepted for
processing.
The transaction did not meet gateway
security guidelines.
3 68 The version parameter is invalid. The value submitted in x_version was
invalid.
3 69 The transaction type is invalid. The value submitted in x_type was
invalid.
3 70 The transaction method is invalid. The value submitted in x_method was
invalid.
3 71 The bank account type is invalid. The value submitted in x_bank_acct_
type was invalid.
3 72 The authorization code is invalid. The value submitted in x_auth_code was
more than six characters in length.
3 73 The driver’s license date of birth is
invalid.
The format of the value submitted in x_
drivers_license_dob was invalid.
3 74 The duty amount is invalid. The value submitted in x_duty failed
format validation.
3 75 The freight amount is invalid. The value submitted in x_freight failed
format validation.
3 76 The tax amount is invalid. The value submitted in x_tax failed
format validation.
3 77 The SSN or tax ID is invalid. The value submitted in x_customer_tax_
id failed validation.
Table 12 Response Reason Codes and Response Reason Text (Continued)
Response
Code
Response
Reason
Code
Response Reason Text Notes
Transaction Details Guide | July 2015 50
Appendix B Reason Response Codes
3 78 The Card Code (CVV2/CVC2/CID) is
invalid.
The value submitted in x_card_code
failed format validation.
3 79 The driver’s license number is invalid. The value submitted in x_drivers_
license_num failed format validation.
3 80 The driver’s license state is invalid. The value submitted in x_drivers_
license_state failed format validation.
3 81 The requested form type is invalid. The merchant requested an integration
method not compatible with the AIM API.
3 82 Scripts are only supported in version
2.5.
The system no longer supports version
2.5; requests cannot be posted to scripts.
3 83 The requested script is either invalid or
no longer supported.
The system no longer supports version
2.5; requests cannot be posted to scripts.
3 84 This reason code is reserved or not
applicable to this API.
3 85 This reason code is reserved or not
applicable to this API.
3 86 This reason code is reserved or not
applicable to this API.
3 87 This reason code is reserved or not
applicable to this API.
3 88 This reason code is reserved or not
applicable to this API.
3 89 This reason code is reserved or not
applicable to this API.
3 90 This reason code is reserved or not
applicable to this API.
3 91 Version 2.5 is no longer supported.
3 92 The gateway no longer supports the
requested method of integration.
3 97 This transaction cannot be accepted. Applicable only to SIM API. Fingerprints
are only valid for a short period of time. If
the fingerprint is more than one hour old
or more than 15 minutes into the future, it
will be rejected. This code indicates that
the transaction fingerprint has expired.
3 98 This transaction cannot be accepted. Applicable only to SIM API. The
transaction fingerprint has already been
used.
Table 12 Response Reason Codes and Response Reason Text (Continued)
Response
Code
Response
Reason
Code
Response Reason Text Notes
Transaction Details Guide | July 2015 51
Appendix B Reason Response Codes
3 99 This transaction cannot be accepted. Applicable only to SIM API. The servergenerated
fingerprint does not match the
merchant-specified fingerprint in the x_
fp_hash field.
3 100 The eCheck.Net type is invalid. Applicable only to eCheck.Net. The
value specified in the x_echeck_type
field is invalid.
3 101 The given name on the account and/or
the account type does not match the
actual account.
Applicable only to eCheck.Net. The
specified name on the account and/or
the account type do not match the NOC
record for this account.
3 102 This request cannot be accepted. A password or Transaction Key was
submitted with this WebLink request.
This is a high security risk.
3 103 This transaction cannot be accepted. A valid fingerprint, Transaction Key, or
password is required for this transaction.
3 104 This transaction is currently under
review.
Applicable only to eCheck.Net. The
value submitted for country failed
validation.
3 105 This transaction is currently under
review.
Applicable only to eCheck.Net. The
values submitted for city and country
failed validation.
3 106 This transaction is currently under
review.
Applicable only to eCheck.Net. The
value submitted for company failed
validation.
3 107 This transaction is currently under
review.
Applicable only to eCheck.Net. The
value submitted for bank account name
failed validation.
3 108 This transaction is currently under
review.
Applicable only to eCheck.Net. The
values submitted for first name and last
name failed validation.
3 109 This transaction is currently under
review.
Applicable only to eCheck.Net. The
values submitted for first name and last
name failed validation.
3 110 This transaction is currently under
review.
Applicable only to eCheck.Net. The
value submitted for bank account name
does not contain valid characters.
3 116 The authentication indicator is invalid.
Please contact cardholder
authentication provider for resolution.
This error is only applicable to Verified by
Visa and MasterCard SecureCode
transactions. The ECI value for a Visa
transaction; or the UCAF indicator for a
MasterCard transaction submitted in the
x_authentication_indicator field is invalid.
Table 12 Response Reason Codes and Response Reason Text (Continued)
Response
Code
Response
Reason
Code
Response Reason Text Notes
Transaction Details Guide | July 2015 52
Appendix B Reason Response Codes
3 117 The cardholder authentication value is
invalid. Please contact cardholder
authentication provider for resolution.
This error is only applicable to Verified by
Visa and MasterCard SecureCode
transactions. The CAVV for a Visa
transaction; or the AVV/UCAF for a
MasterCard transaction is invalid.
3 118 The combination of authentication
indicator and cardholder authentication
value is invalid. Please contact
cardholder authentication provider for
resolution.
This error is only applicable to Verified by
Visa and MasterCard SecureCode
transactions. The combination of
authentication indicator and cardholder
authentication value for a Visa or
MasterCard transaction is invalid.
3 119 Transactions having cardholder
authentication values cannot be marked
as recurring.
This error is only applicable to Verified by
Visa and MasterCard SecureCode
transactions. Transactions submitted
with a value in x_authentication_
indicator and x_recurring_billing=YES
will be rejected.
3 120 An error occurred during processing.
Please try again.
The system-generated void for the
original timed-out transaction failed. (The
original transaction timed out while
waiting for a response from the
authorizer.)
3 121 An error occurred during processing.
Please try again.
The system-generated void for the
original errored transaction failed. (The
original transaction experienced a
database error.)
3 122 An error occurred during processing.
Please try again.
The system-generated void for the
original errored transaction failed. (The
original transaction experienced a
processing error.)
3 123 This account has not been given the
permission(s) required for this request.
The transaction request must include the
API Login ID associated with the
payment gateway account.
2 127 The transaction resulted in an AVS
mismatch. The address provided does
not match billing address of cardholder.
The system-generated void for the
original AVS-rejected transaction failed.
3 128 This transaction cannot be processed. The customer’s financial institution does
not currently allow transactions for this
account.
3 130 This payment gateway account has
been closed.
IFT: The payment gateway account
status is Blacklisted.
3 131 This transaction cannot be accepted at
this time.
IFT: The payment gateway account
status is Suspended-STA.
Table 12 Response Reason Codes and Response Reason Text (Continued)
Response
Code
Response
Reason
Code
Response Reason Text Notes
Transaction Details Guide | July 2015 53
Appendix B Reason Response Codes
3 132 This transaction cannot be accepted at
this time.
IFT: The payment gateway account
status is Suspended-Blacklist.
2 141 This transaction has been declined. The system-generated void for the
original FraudScreen-rejected
transaction failed.
2 145 This transaction has been declined. The system-generated void for the
original card code-rejected and AVSrejected
transaction failed.
3 152 The transaction was authorized, but the
client could not be notified; the
transaction will not be settled.
The system-generated void for the
original transaction failed. The response
for the original transaction could not be
communicated to the client.
2 165 This transaction has been declined. The system-generated void for the
original card code-rejected transaction
failed.
3 170 An error occurred during processing.
Please contact the merchant.
Concord EFS – Provisioning at the
processor has not been completed.
2 171 An error occurred during processing.
Please contact the merchant.
Concord EFS – This request is invalid.
2 172 An error occurred during processing.
Please contact the merchant.
Concord EFS – The store ID is invalid.
3 173 An error occurred during processing.
Please contact the merchant.
Concord EFS – The store key is invalid.
2 174 The transaction type is invalid. Please
contact the merchant.
Concord EFS – This transaction type is
not accepted by the processor.
3 175 The processor does not allow voiding of
credits.
Concord EFS – This transaction is not
allowed. The Concord EFS processing
platform does not support voiding credit
transactions. Please debit the credit card
instead of voiding the credit.
3 180 An error occurred during processing.
Please try again.
The processor response format is
invalid.
3 181 An error occurred during processing.
Please try again.
The system-generated void for the
original invalid transaction failed. (The
original transaction included an invalid
processor response format.)
3 185 This reason code is reserved or not
applicable to this API.
4 193 The transaction is currently under
review.
The transaction was placed under review
by the risk management system.
Table 12 Response Reason Codes and Response Reason Text (Continued)
Response
Code
Response
Reason
Code
Response Reason Text Notes
Transaction Details Guide | July 2015 54
Appendix B Reason Response Codes
2 200 This transaction has been declined. This error code applies only to
merchants on FDC Omaha. The credit
card number is invalid.
2 201 This transaction has been declined. This error code applies only to
merchants on FDC Omaha. The
expiration date is invalid.
2 202 This transaction has been declined. This error code applies only to
merchants on FDC Omaha. The
transaction type is invalid.
2 203 This transaction has been declined. This error code applies only to
merchants on FDC Omaha. The value
submitted in the amount field is invalid.
2 204 This transaction has been declined. This error code applies only to
merchants on FDC Omaha. The
department code is invalid.
2 205 This transaction has been declined. This error code applies only to
merchants on FDC Omaha. The value
submitted in the merchant number field
is invalid.
2 206 This transaction has been declined. This error code applies only to
merchants on FDC Omaha. The
merchant is not on file.
2 207 This transaction has been declined. This error code applies only to
merchants on FDC Omaha. The
merchant account is closed.
2 208 This transaction has been declined. This error code applies only to
merchants on FDC Omaha. The
merchant is not on file.
2 209 This transaction has been declined. This error code applies only to
merchants on FDC Omaha.
Communication with the processor could
not be established.
2 210 This transaction has been declined. This error code applies only to
merchants on FDC Omaha. The
merchant type is incorrect.
2 211 This transaction has been declined. This error code applies only to
merchants on FDC Omaha. The
cardholder is not on file.
2 212 This transaction has been declined. This error code applies only to
merchants on FDC Omaha. The bank
configuration is not on file
Table 12 Response Reason Codes and Response Reason Text (Continued)
Response
Code
Response
Reason
Code
Response Reason Text Notes
Transaction Details Guide | July 2015 55
Appendix B Reason Response Codes
2 213 This transaction has been declined. This error code applies only to
merchants on FDC Omaha. The
merchant assessment code is incorrect.
2 214 This transaction has been declined. This error code applies only to
merchants on FDC Omaha. This function
is currently unavailable.
2 215 This transaction has been declined. This error code applies only to
merchants on FDC Omaha. The
encrypted PIN field format is invalid.
2 216 This transaction has been declined. This error code applies only to
merchants on FDC Omaha. The ATM
term ID is invalid.
2 217 This transaction has been declined. This error code applies only to
merchants on FDC Omaha. This
transaction experienced a general
message format problem.
2 218 This transaction has been declined. This error code applies only to
merchants on FDC Omaha. The PIN
block format or PIN availability value is
invalid.
2 219 This transaction has been declined. This error code applies only to
merchants on FDC Omaha. The ETC
void is unmatched.
2 220 This transaction has been declined. This error code applies only to
merchants on FDC Omaha. The primary
CPU is not available.
2 221 This transaction has been declined. This error code applies only to
merchants on FDC Omaha. The SE
number is invalid.
2 222 This transaction has been declined. This error code applies only to
merchants on FDC Omaha. Duplicate
auth request (from INAS).
2 223 This transaction has been declined. This error code applies only to
merchants on FDC Omaha. This
transaction experienced an unspecified
error.
2 224 This transaction has been declined. This error code applies only to
merchants on FDC Omaha. Please reenter
the transaction.
3 243 Recurring billing is not allowed for this
eCheck.Net type.
The combination of values submitted for
x_recurring_billing and x_echeck_type is
not allowed.
Table 12 Response Reason Codes and Response Reason Text (Continued)
Response
Code
Response
Reason
Code
Response Reason Text Notes
Transaction Details Guide | July 2015 56
Appendix B Reason Response Codes
3 244 This eCheck.Net type is not allowed for
this Bank Account Type.
The combination of values submitted for
x_bank_acct_type and x_echeck_type is
not allowed.
3 245 This eCheck.Net type is not allowed
when using the payment gateway
hosted payment form.
The value submitted for x_echeck_type
is not allowed when using the payment
gateway hosted payment form.
3 246 This eCheck.Net type is not allowed. The merchant’s payment gateway
account is not enabled to submit the
eCheck.Net type.
3 247 This eCheck.Net type is not allowed. The combination of values submitted for
x_type and x_echeck_type is not
allowed.
3 248 The check number is invalid. Invalid check number. Check number
can only consist of letters and numbers
and not more than 15 characters.
2 250 This transaction has been declined. This transaction was submitted from a
blocked IP address.
2 251 This transaction has been declined. The transaction was declined as a result
of triggering a Fraud Detection Suite
filter.
4 252 Your order has been received. Thank
you for your business!
The transaction was accepted, but is
being held for merchant review. The
merchant can customize the customer
response in the Merchant Interface.
4 253 Your order has been received. Thank
you for your business!
The transaction was accepted and was
authorized, but is being held for
merchant review. The merchant can
customize the customer response in the
Merchant Interface.
2 254 Your transaction has been declined. The transaction was declined after
manual review.
3 261 An error occurred during processing.
Please try again.
The transaction experienced an error
during sensitive data encryption and was
not processed. Please try again.
3 270 The line item [item number] is invalid. A value submitted in x_line_item for the
item referenced is invalid.
3 271 The number of line items submitted is
not allowed. A maximum of 30 line items
can be submitted.
The number of line items submitted
exceeds the allowed maximum of 30.
Table 12 Response Reason Codes and Response Reason Text (Continued)
Response
Code
Response
Reason
Code
Response Reason Text Notes
Transaction Details Guide | July 2015 57
Appendix B Reason Response Codes
3 288 Merchant is not registered as a
Cardholder Authentication participant.
This transaction cannot be accepted.
The merchant has not indicated
participation in any Cardholder
Authentication Programs in the Merchant
Interface.
3 289 This processor does not accept zero
dollar authorization for this card type.
Your credit card processing service does
not yet accept zero dollar authorizations
for Visa credit cards. You can find your
credit card processor listed on your
merchant profile.
3 290 One or more required AVS values for
zero dollar authorization were not
submitted.
When submitting authorization requests
for Visa, the address and zip code fields
must be entered.
4 295 The amount of this request was only
partially approved on the given prepaid
card. Additional payments are required
to complete the balance of this
transaction.
3 296 The specified SplitTenderId is not valid.
3 297 A Transaction ID and a Split Tender ID
cannot both be used in a single
transaction request.
3 300 The device ID is invalid. The value submitted for x_device_id is
invalid.
3 301 The device batch ID is invalid. The value submitted for x_device_
batch_id is invalid.
3 302 The reversal flag is invalid. The value submitted for x_reversal is
invalid.
3 303 The device batch is full. Please close
the batch.
The current device batch must be closed
manually from the POS device.
3 304 The original transaction is in a closed
batch.
The original transaction has been settled
and cannot be reversed.
3 305 The merchant is configured for autoclose.

This merchant is configured for autoclose
and cannot manually close
batches.
3 306 The batch is already closed. The batch is already closed.
1 307 The reversal was processed
successfully.
The reversal was processed
successfully.
1 308 Original transaction for reversal not
found.
The transaction submitted for reversal
was not found.
3 309 The device has been disabled. The device has been disabled.
Table 12 Response Reason Codes and Response Reason Text (Continued)
Response
Code
Response
Reason
Code
Response Reason Text Notes
Transaction Details Guide | July 2015 58
Appendix B Reason Response Codes
1 310 This transaction has already been
voided.
This transaction has already been
voided.
1 311 This transaction has already been
captured
This transaction has already been
captured.
2 315 The credit card number is invalid. This is a processor-issued decline.
2 316 The credit card expiration date is invalid. This is a processor-issued decline.
2 317 The credit card has expired. This is a processor-issued decline.
2 318 A duplicate transaction has been
submitted.
This is a processor-issued decline.
2 319 The transaction cannot be found. This is a processor-issued decline. 