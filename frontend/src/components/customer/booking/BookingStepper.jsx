import React from 'react'

function BookingStepper({ currentStep }) {
  const steps = ['Details', 'Service', 'Date', 'Confirm']

  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              index + 1 <= currentStep ? 'bg-[#D4AF37] text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {index + 1}
            </div>
            <span className={`ml-2 text-sm font-semibold ${index + 1 <= currentStep ? 'text-[#8B5E3C]' : 'text-gray-400'}`}>
              {step}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className={`w-12 h-0.5 mx-3 ${index + 1 < currentStep ? 'bg-[#D4AF37]' : 'bg-gray-200'}`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

export default BookingStepper