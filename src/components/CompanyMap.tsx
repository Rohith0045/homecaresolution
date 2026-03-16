import { MapPin, Clock, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

const CompanyMap = () => {
  const address = "10, 8PV2+CWR, Raja Complex, Nasiyanur Rd, Narayanavalasu, Erode, Tamil Nadu 638011";
  const encodedAddress = encodeURIComponent(address);
  const mapUrl = `https://maps.google.com/maps?q=${encodedAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">
          Find a Store
        </h2>

        <div className="flex flex-col md:flex-row rounded-3xl overflow-hidden border border-border shadow-2xl glass-card">
          {/* Info Sidebar */}
          <div className="w-full md:w-1/3 p-8 bg-card/50 backdrop-blur-md flex flex-col justify-center border-r border-border">
            <h3 className="font-display text-2xl font-bold text-foreground mb-6">
              Pure & Perfect Chemicals
            </h3>

            <div className="space-y-6 mb-8 text-foreground/80">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary/10 text-primary mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium leading-relaxed">
                    {address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary/10 text-primary mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Open today: <span className="text-foreground">9:00 AM - 9:00 PM</span>
                  </p>
                </div>
              </div>
            </div>

            <Button 
              asChild 
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] group"
            >
              <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                <Navigation className="w-4 h-4 transition-transform group-hover:rotate-12" />
                Get Directions
              </a>
            </Button>
          </div>

          {/* Map */}
          <div className="w-full md:w-2/3 h-[400px] md:h-[500px] relative">
            <iframe
              src={mapUrl}
              className="w-full h-full border-0 absolute inset-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Company Location Map"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyMap;
