-- Enable realtime for deliveries table
ALTER PUBLICATION supabase_realtime ADD TABLE public.deliveries;

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  read BOOLEAN NOT NULL DEFAULT false,
  delivery_id UUID REFERENCES public.deliveries(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own notifications
CREATE POLICY "Users can view their own notifications" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications" 
ON public.notifications 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Users can delete their own notifications
CREATE POLICY "Users can delete their own notifications" 
ON public.notifications 
FOR DELETE 
USING (auth.uid() = user_id);

-- System can insert notifications (using service role)
CREATE POLICY "Allow insert for authenticated users" 
ON public.notifications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Create function to notify on delivery status change
CREATE OR REPLACE FUNCTION public.notify_delivery_update()
RETURNS TRIGGER AS $$
DECLARE
  client_user_id UUID;
  chauffeur_user_id UUID;
  order_info RECORD;
BEGIN
  -- Get order info with client
  SELECT o.order_number, o.client_id, c.user_id as client_user_id
  INTO order_info
  FROM public.orders o
  LEFT JOIN public.clients c ON o.client_id = c.id
  WHERE o.id = NEW.order_id;

  -- Create notification for chauffeur
  INSERT INTO public.notifications (user_id, title, message, type, delivery_id)
  VALUES (
    NEW.chauffeur_id,
    'Livraison mise à jour',
    CASE NEW.status
      WHEN 'assigned' THEN 'Nouvelle livraison assignée: ' || COALESCE(order_info.order_number, 'N/A')
      WHEN 'in_progress' THEN 'Livraison en cours: ' || COALESCE(order_info.order_number, 'N/A')
      WHEN 'completed' THEN 'Livraison terminée: ' || COALESCE(order_info.order_number, 'N/A')
      WHEN 'failed' THEN 'Livraison échouée: ' || COALESCE(order_info.order_number, 'N/A')
      ELSE 'Statut mis à jour: ' || COALESCE(order_info.order_number, 'N/A')
    END,
    CASE NEW.status
      WHEN 'completed' THEN 'success'
      WHEN 'failed' THEN 'error'
      ELSE 'info'
    END,
    NEW.id
  );

  -- Create notification for client if they have a user_id
  IF order_info.client_user_id IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, title, message, type, delivery_id)
    VALUES (
      order_info.client_user_id,
      'Mise à jour de votre commande',
      CASE NEW.status
        WHEN 'assigned' THEN 'Votre commande ' || COALESCE(order_info.order_number, '') || ' est en préparation'
        WHEN 'in_progress' THEN 'Votre commande ' || COALESCE(order_info.order_number, '') || ' est en cours de livraison'
        WHEN 'completed' THEN 'Votre commande ' || COALESCE(order_info.order_number, '') || ' a été livrée'
        WHEN 'failed' THEN 'Problème avec votre commande ' || COALESCE(order_info.order_number, '')
        ELSE 'Mise à jour de votre commande ' || COALESCE(order_info.order_number, '')
      END,
      CASE NEW.status
        WHEN 'completed' THEN 'success'
        WHEN 'failed' THEN 'error'
        ELSE 'info'
      END,
      NEW.id
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for delivery status changes
CREATE TRIGGER on_delivery_status_change
AFTER UPDATE OF status ON public.deliveries
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION public.notify_delivery_update();