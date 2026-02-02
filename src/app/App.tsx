import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppRouter } from "./providers/router";
import "../index.css";
import { LocationProvider } from "../entities/location/model/LocationProvider";
import { FavoriteProvider } from "../entities/favorite/model/FavoriteProvider";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LocationProvider>
        <FavoriteProvider>
          <AppRouter />
        </FavoriteProvider>
      </LocationProvider>
    </QueryClientProvider>
  );
}

export default App;
