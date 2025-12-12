-- Korrigiere die Transaktion die bereits bezahlt wurde aber Status nicht aktualisiert wurde
UPDATE transactions 
SET status = 'completed', 
    payment_status = 'finished'
WHERE id = 'f1235e6d-3a71-4351-b4e4-bd8d30b47a75';