import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home } from "lucide-react";
import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    const previousTitle = document.title;
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const previousDescription = description?.content;
    const openGraphTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
    const previousOpenGraphTitle = openGraphTitle?.content;
    const openGraphDescription = document.querySelector<HTMLMetaElement>('meta[property="og:description"]');
    const previousOpenGraphDescription = openGraphDescription?.content;
    const existingRobots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const robots = existingRobots ?? document.createElement("meta");
    const previousRobots = existingRobots?.content;

    if (!existingRobots) {
      robots.name = "robots";
      document.head.appendChild(robots);
    }

    document.title = "Pagina niet gevonden | Be Well Thai Massage";
    if (description) description.content = "De pagina bestaat niet of is verplaatst. Ga terug naar Be Well Thai Massage in Putte.";
    if (openGraphTitle) openGraphTitle.content = "Pagina niet gevonden | Be Well Thai Massage";
    if (openGraphDescription) openGraphDescription.content = "De pagina bestaat niet of is verplaatst. Bezoek de homepage van Be Well Thai Massage.";
    robots.content = "noindex, follow";

    return () => {
      document.title = previousTitle;
      if (description && previousDescription !== undefined) description.content = previousDescription;
      if (openGraphTitle && previousOpenGraphTitle !== undefined) openGraphTitle.content = previousOpenGraphTitle;
      if (openGraphDescription && previousOpenGraphDescription !== undefined) openGraphDescription.content = previousOpenGraphDescription;
      if (existingRobots) {
        if (previousRobots !== undefined) robots.content = previousRobots;
      } else {
        robots.remove();
      }
    };
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <Card className="w-full max-w-lg mx-4 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-red-100 rounded-full animate-pulse" />
              <AlertCircle className="relative h-16 w-16 text-red-500" />
            </div>
          </div>

          <p className="text-sm font-semibold tracking-[0.2em] text-primary mb-2">404</p>

          <h1 className="text-2xl font-semibold text-slate-900 mb-4">
            Pagina niet gevonden
          </h1>

          <p className="text-slate-600 mb-8 leading-relaxed">
            De pagina die u zoekt bestaat niet of is verplaatst. Controleer de link of ga terug naar de homepage.
          </p>

          <div
            id="not-found-button-group"
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg">
              <a href="/">
                <Home className="w-4 h-4 mr-2" />
                Naar de homepagina
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
