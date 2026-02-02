import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppRouter } from "./providers/router";
import "../index.css";
import { LocationProvider } from "../entities/location/model/LocationProvider";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LocationProvider>
        <AppRouter />
      </LocationProvider>
    </QueryClientProvider>
  );
}

export default App;
