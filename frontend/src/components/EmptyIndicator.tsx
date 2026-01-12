export function EmptyIndicator() {
  return (
    <div>
      <div className="bg-primary absolute inset-0 z-30  opacity-70 mix-blend-color" />
      <img
        src="https://images.unsplash.com/photo-1604076850742-4c7221f3101b?q=80&w=400&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Photo by mymind on Unsplash"
        title="Photo by mymind on Unsplash"
        className="relative z-20 w-full object-cover brightness-240 grayscale size-full"
      />
    </div>
  );
}
