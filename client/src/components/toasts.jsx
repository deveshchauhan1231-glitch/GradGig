function Toast_success({ title = "Success", message = "The action was successful" }){
    return(
        <>
        <div role="alert" className="rounded-md border border-green-500 bg-green-50 p-4 shadow-sm">
  <div className="flex items-start gap-4">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="-mt-0.5 size-6 text-green-700"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>

    <div className="flex-1">
      <strong className="block leading-tight font-medium text-green-800"> {title} </strong>

      <p className="mt-0.5 text-sm text-green-700">
        {message}
      </p>
    </div>
  </div>
</div>
        </>
    )
}

function Toast_failure({ title = "Error", message = "The action could not be completed" }){
    return(
        <>
        <div role="alert" className="rounded-md border border-red-500 bg-red-50 p-4 shadow-sm">
  <div className="flex items-start gap-4">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="-mt-0.5 size-6 text-red-700"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
      />
    </svg>

    <div className="flex-1">
      <strong className="block leading-tight font-medium text-red-800"> {title} </strong>

      <p className="mt-0.5 text-sm text-red-700">
        {message}
      </p>
    </div>
  </div>
</div>
        </>
    )
}

export {Toast_failure,Toast_success}
