import React from 'react'
import {PayPalButtons, PayPalScriptProvider} from '@paypal/react-paypal-js'

const PaypalButton = ({amount, onSuccess, onError}) => {
  return (
    <PayPalScriptProvider 
      options={{'client-id':`${import.meta.env.VITE_PAYPAL_CLIENT_ID}`}}
    >
       <PayPalButtons
        style={{layout:'vertical'}} 
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [{ amount: { value: parseFloat(amount).toFixed(2) } }]
          })
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then(details => {
            onSuccess(details)
          })
        }}
        onError={(err) => {
          console.error('PayPal Error', err);
          onError(err)
        }}
       />
    </PayPalScriptProvider>
  )
}

export default PaypalButton




// import React from 'react'
// import {PayPalButtons , PayPalScriptProvider} from '@paypal/react-paypal-js'

// const PaypalButton = ({amount , onSuccess , onError}) => {

//   return (
//     <PayPalScriptProvider 
//      options={{'client-id':'ATzr4lmVz5j6-hxILP5uXPnRGK1Tvv8GvsC73_LV-hkSZO9I-gf4BoqVkhruAB-ww-jfi8LvHCuHf4zf'}}
//     >
//        <PayPalButtons
//         style={{layout:'vertical'}} 
//         createOrder={(data,actions)=>{
//           return actions.order.create({
//             purchase_units:[{amount:{value:amount}}]
//           })
//         }}

//         onApprove={(data,actions)=>{
//           return actions.order.capture().then(onSuccess)
//         }}
//         onError={onError}
//        />

//     </PayPalScriptProvider>
//   )
// }

// export default PaypalButton
