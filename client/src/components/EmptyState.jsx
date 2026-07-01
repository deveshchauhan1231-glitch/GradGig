function EmptyState(){
    return(
        <>
        <div class="max-w-md text-center">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    class="mx-auto size-20 text-gray-400"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
    />
  </svg>

  <h2 class="mt-6 text-2xl font-bold text-gray-900">No items found</h2>

  <p class="mt-4 text-pretty text-gray-700">
    Nothing to see here yet. The server is running normally, but there's no data to display right now. Please check back later.

  </p>

  
 
</div>
        </>
    )
}

export default EmptyState