-- Create notifications table for real-time alerts
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info', -- 'info', 'warning', 'success', 'error'
  category TEXT NOT NULL DEFAULT 'general', -- 'family_invitation', 'budget_alert', 'spending_alert', 'recommendation'
  read BOOLEAN NOT NULL DEFAULT false,
  action_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for notifications
CREATE POLICY "Users can view their own notifications" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
ON public.notifications 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (true);

-- Create function to update timestamps
CREATE TRIGGER update_notifications_updated_at
BEFORE UPDATE ON public.notifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create insights table to store AI-generated recommendations
CREATE TABLE public.insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  family_id UUID,
  type TEXT NOT NULL, -- 'budgeting', 'spending', 'savings', 'investment'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  recommendations JSONB NOT NULL DEFAULT '[]',
  confidence_score NUMERIC NOT NULL DEFAULT 0.5,
  data_period_start DATE NOT NULL,
  data_period_end DATE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.insights ENABLE ROW LEVEL SECURITY;

-- Create policies for insights
CREATE POLICY "Users can view their insights" 
ON public.insights 
FOR SELECT 
USING (auth.uid() = user_id OR (family_id IS NOT NULL AND EXISTS (
  SELECT 1 FROM family_members fm 
  WHERE fm.family_id = insights.family_id AND fm.user_id = auth.uid()
)));

CREATE POLICY "System can manage insights" 
ON public.insights 
FOR ALL 
USING (true);

-- Create function to update timestamps
CREATE TRIGGER update_insights_updated_at
BEFORE UPDATE ON public.insights
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for notifications
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.notifications;