
const url = 'https://knpovgnwgcklxarngumu.supabase.co/functions/v1/create-razorpay-order';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtucG92Z253Z2NrbHhhcm5ndW11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2NjkxNTMsImV4cCI6MjA4OTI0NTE1M30.ZlAtScpvG99JQLsVMrrATqmqhvc21mcM04Ks5OsKvh0';

async function test() {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${anonKey}`,
         'apikey': anonKey
      },
      body: JSON.stringify({ amount: 100, currency: 'INR' })
    });
    const data = await response.json();
    console.log('--- Edge Function Response ---');
    console.log(data);
  } catch (err) {
    console.error('--- Error ---');
    console.error(err);
  }
}

test();
