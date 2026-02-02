export function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "0 16px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {children}
    </div>
  );
}
