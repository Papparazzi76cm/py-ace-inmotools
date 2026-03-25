import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/AppLayout";
import Dashboard from "./pages/Dashboard";
import DescripcionesPage from "./pages/DescripcionesPage";
import CostesPage from "./pages/CostesPage";
import RentabilidadPage from "./pages/RentabilidadPage";
import ToolPlaceholder from "./pages/ToolPlaceholder";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/herramientas/descripciones" element={<DescripcionesPage />} />
            <Route path="/herramientas/costes" element={<CostesPage />} />
            <Route path="/herramientas/rentabilidad" element={<RentabilidadPage />} />
            <Route path="/herramientas/:toolId" element={<ToolPlaceholder />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
