-- Create vehicles table for fleet management
CREATE TABLE public.vehicles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    registration_number TEXT NOT NULL UNIQUE,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'truck',
    capacity_kg NUMERIC,
    capacity_m3 NUMERIC,
    year INTEGER,
    status TEXT NOT NULL DEFAULT 'available',
    fuel_type TEXT DEFAULT 'diesel',
    last_maintenance_date DATE,
    next_maintenance_date DATE,
    mileage_km INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Staff can view vehicles" 
ON public.vehicles 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role) OR has_role(auth.uid(), 'chauffeur'::app_role));

CREATE POLICY "Staff can manage vehicles" 
ON public.vehicles 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

-- Add foreign key to deliveries table
ALTER TABLE public.deliveries 
ADD CONSTRAINT fk_deliveries_vehicle 
FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id) ON DELETE SET NULL;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_vehicles_updated_at
BEFORE UPDATE ON public.vehicles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();