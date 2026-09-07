import express from 'express';
import path from 'path';
import fs from 'fs';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { createServer as createViteServer } from 'vite';
import { INITIAL_VEHICLES } from './src/data/vehicles';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// -------------------------------------------------------------
// SUPABASE CREDENTIALS EXTRACTION
// -------------------------------------------------------------
const supabaseUrl = 
  process.env.API_URL || 
  process.env.SUPABASE_URL || 
  process.env.VITE_SUPABASE_URL || 
  '';

const supabaseAnonKey = 
  process.env.PUBLISHABLE_KEY || 
  process.env.SUPABASE_ANON_KEY || 
  process.env.VITE_PUBLISHABLE_KEY || 
  process.env.VITE_SUPABASE_ANON_KEY || 
  '';

const supabaseSecretKey = 
  process.env.Secret_keys || 
  process.env.SECRET_KEYS || 
  process.env.SUPABASE_SERVICE_ROLE_KEY || 
  supabaseAnonKey;

let supabaseAdmin: SupabaseClient | null = null;

if (supabaseUrl && (supabaseSecretKey || supabaseAnonKey)) {
  try {
    supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey || supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    console.log('✅ Supabase conectado com sucesso:', supabaseUrl);
  } catch (err) {
    console.error('❌ Erro ao inicializar cliente Supabase:', err);
  }
} else {
  console.warn('⚠️ Credenciais do Supabase (API_URL, PUBLISHABLE_KEY, Secret_keys) não foram detectadas no ambiente.');
}

// -------------------------------------------------------------
// HELPER: MAP DATABASE ROW <-> TS VEHICLE
// -------------------------------------------------------------
function mapRowToVehicle(row: any): any {
  if (!row) return null;
  return {
    id: row.id,
    category: row.category || 'carro',
    brand: row.brand || '',
    model: row.model || '',
    version: row.version || '',
    yearModel: row.year_model || row.yearModel || '2024',
    mileage: Number(row.mileage) || 0,
    price: Number(row.price) || 0,
    fuel: row.fuel || 'Flex',
    transmission: row.transmission || 'Automático',
    color: row.color || 'Preto',
    bodyType: row.body_type || row.bodyType || 'SUV',
    licensePlateEnd: row.license_plate_end || row.licensePlateEnd || '',
    description: row.description || '',
    features: Array.isArray(row.features) ? row.features : (typeof row.features === 'string' ? JSON.parse(row.features || '[]') : []),
    photos: Array.isArray(row.photos) ? row.photos : (typeof row.photos === 'string' ? JSON.parse(row.photos || '[]') : []),
    featured: Boolean(row.featured),
    status: row.status || 'Disponível',
    createdAt: row.created_at || row.createdAt,
    updatedAt: row.updated_at || row.updatedAt,
  };
}

function mapVehicleToRow(v: any): any {
  return {
    id: v.id,
    category: v.category || 'carro',
    brand: v.brand || '',
    model: v.model || '',
    version: v.version || '',
    year_model: v.yearModel || v.year_model || '2024',
    mileage: Number(v.mileage) || 0,
    price: Number(v.price) || 0,
    fuel: v.fuel || 'Flex',
    transmission: v.transmission || 'Automático',
    color: v.color || 'Preto',
    body_type: v.bodyType || v.body_type || 'SUV',
    license_plate_end: v.licensePlateEnd || v.license_plate_end || '',
    description: v.description || '',
    features: Array.isArray(v.features) ? v.features : [],
    photos: Array.isArray(v.photos) ? v.photos : [],
    featured: Boolean(v.featured),
    status: v.status || 'Disponível',
    updated_at: new Date().toISOString(),
  };
}

// In-memory fallback if Supabase is temporarily unconfigured
let fallbackVehicles: any[] = [...INITIAL_VEHICLES];

// -------------------------------------------------------------
// DATABASE AUTO-INITIALIZER / SEEDER
// -------------------------------------------------------------
async function initializeSupabaseDatabase() {
  if (!supabaseAdmin) return;

  try {
    // 1. Check if vehicles table is accessible and has data
    const { data: existingVehicles, error: vehError } = await supabaseAdmin
      .from('vehicles')
      .select('id')
      .limit(1);

    if (vehError) {
      console.warn('ℹ️ Tabela "vehicles" no Supabase pode precisar ser criada pelo SQL Editor:', vehError.message);
    } else if (!existingVehicles || existingVehicles.length === 0) {
      console.log('📦 Tabela "vehicles" está vazia. Populando com o estoque inicial...');
      for (const vehicle of INITIAL_VEHICLES) {
        const row = mapVehicleToRow(vehicle);
        row.created_at = new Date().toISOString();
        await supabaseAdmin.from('vehicles').upsert(row);
      }
      console.log('✅ Estoque inicial semeado com sucesso no Supabase!');
    }

    // 2. Check if default admin exists in 'admins' table
    const { data: existingAdmins, error: admError } = await supabaseAdmin
      .from('admins')
      .select('id')
      .limit(1);

    if (!admError && (!existingAdmins || existingAdmins.length === 0)) {
      console.log('👤 Criando administrador padrão no Supabase...');
      await supabaseAdmin.from('admins').insert({
        email: 'admin@gtrmotors.com.br',
        password_hash: 'GTR8217#',
        name: 'Administrador GTR',
        role: 'admin',
      });
      console.log('✅ Administrador padrão criado com sucesso!');
    }
  } catch (err) {
    console.warn('Aviso durante inicialização do Supabase:', err);
  }
}

// -------------------------------------------------------------
// REST API ENDPOINTS
// -------------------------------------------------------------

// 1. Status & Health Check
app.get('/api/status', async (req, res) => {
  let isConnected = false;
  let vehicleCount = 0;
  let errorMsg = null;

  if (supabaseAdmin) {
    try {
      const { count, error } = await supabaseAdmin
        .from('vehicles')
        .select('*', { count: 'exact', head: true });
      
      if (!error) {
        isConnected = true;
        vehicleCount = count || 0;
      } else {
        errorMsg = error.message;
      }
    } catch (e: any) {
      errorMsg = e.message;
    }
  }

  res.json({
    status: 'ok',
    supabase: {
      configured: Boolean(supabaseUrl),
      connected: isConnected,
      url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : null,
      vehicleCount,
      error: errorMsg,
    },
  });
});

// 2. GET /api/vehicles - List all vehicles
app.get('/api/vehicles', async (req, res) => {
  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        const mapped = data.map(mapRowToVehicle);
        if (mapped.length > 0) {
          fallbackVehicles = mapped;
        }
        return res.json({
          success: true,
          source: 'supabase',
          vehicles: mapped,
        });
      }
      if (error) {
        console.warn('Erro ao consultar Supabase /api/vehicles:', error.message);
      }
    } catch (e: any) {
      console.warn('Erro ao consultar Supabase, usando fallback:', e.message);
    }
  }

  // Fallback to memory
  res.json({
    success: true,
    source: 'fallback',
    vehicles: fallbackVehicles,
  });
});

// 3. POST /api/vehicles - Create or update vehicle
app.post('/api/vehicles', async (req, res) => {
  const vehicle = req.body;
  if (!vehicle || !vehicle.brand || !vehicle.model) {
    return res.status(400).json({ error: 'Dados do veículo inválidos (marca e modelo obrigatórios).' });
  }

  const newId = vehicle.id || `veh-${Date.now()}`;
  const fullVehicle = {
    ...vehicle,
    id: newId,
    createdAt: vehicle.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Always update in-memory list first
  const existsIndex = fallbackVehicles.findIndex((v) => v.id === newId);
  if (existsIndex >= 0) {
    fallbackVehicles[existsIndex] = fullVehicle;
  } else {
    fallbackVehicles = [fullVehicle, ...fallbackVehicles];
  }

  if (supabaseAdmin) {
    try {
      const row = mapVehicleToRow(fullVehicle);
      row.created_at = fullVehicle.createdAt;
      const { data, error } = await supabaseAdmin
        .from('vehicles')
        .upsert(row)
        .select()
        .single();

      if (error) {
        console.error('Erro ao salvar no Supabase:', error.message);
      } else if (data) {
        const saved = mapRowToVehicle(data);
        return res.status(201).json({
          success: true,
          source: 'supabase',
          vehicle: saved,
        });
      }
    } catch (e: any) {
      console.warn('Erro no Supabase ao cadastrar veículo:', e.message);
    }
  }

  res.status(201).json({
    success: true,
    source: 'fallback',
    vehicle: fullVehicle,
  });
});

// 4. PUT /api/vehicles/:id - Update vehicle
app.put('/api/vehicles/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const updatedAt = new Date().toISOString();

  // Update in-memory fallback
  fallbackVehicles = fallbackVehicles.map((v) =>
    v.id === id ? { ...v, ...updates, updatedAt } : v
  );
  const updated = fallbackVehicles.find((v) => v.id === id);

  if (supabaseAdmin) {
    try {
      const row = mapVehicleToRow({ ...(updated || updates), id });
      const { data, error } = await supabaseAdmin
        .from('vehicles')
        .upsert(row)
        .select()
        .single();

      if (!error && data) {
        return res.json({
          success: true,
          source: 'supabase',
          vehicle: mapRowToVehicle(data),
        });
      }
      if (error) {
        console.warn('Erro ao atualizar no Supabase:', error.message);
      }
    } catch (e: any) {
      console.warn('Erro ao atualizar no Supabase:', e.message);
    }
  }

  res.json({
    success: true,
    source: 'fallback',
    vehicle: updated || { ...updates, id, updatedAt },
  });
});

// 5. DELETE /api/vehicles/:id - Delete vehicle
app.delete('/api/vehicles/:id', async (req, res) => {
  const { id } = req.params;

  // Always update in-memory fallback
  fallbackVehicles = fallbackVehicles.filter((v) => v.id !== id);

  if (supabaseAdmin) {
    try {
      const { error } = await supabaseAdmin
        .from('vehicles')
        .delete()
        .eq('id', id);

      if (error) {
        console.warn('Erro ao deletar no Supabase:', error.message);
      }
    } catch (e: any) {
      console.warn('Erro ao deletar no Supabase:', e.message);
    }
  }

  res.json({ success: true, id });
});

// 6. POST /api/vehicles/reset - Reset to default inventory
app.post('/api/vehicles/reset', async (req, res) => {
  fallbackVehicles = [...INITIAL_VEHICLES];

  if (supabaseAdmin) {
    try {
      // Clear current vehicles
      await supabaseAdmin.from('vehicles').delete().neq('id', '___non_existent___');
      
      // Re-insert defaults
      for (const v of INITIAL_VEHICLES) {
        const row = mapVehicleToRow(v);
        row.created_at = new Date().toISOString();
        await supabaseAdmin.from('vehicles').upsert(row);
      }

      return res.json({
        success: true,
        source: 'supabase',
        vehicles: INITIAL_VEHICLES,
      });
    } catch (e: any) {
      console.warn('Erro ao resetar no Supabase:', e.message);
    }
  }

  res.json({
    success: true,
    source: 'fallback',
    vehicles: fallbackVehicles,
  });
});

// 7. POST /api/auth/login - Admin Login with email/password or master code
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const cleanPass = (password || '').trim();
  const cleanEmail = (email || '').trim().toLowerCase();

  if (!cleanPass) {
    return res.status(400).json({ error: 'Informe a senha de acesso.' });
  }

  // Master override code
  if (cleanPass === 'GTR8217#' || cleanPass.toUpperCase() === 'GTR8217#') {
    return res.json({
      success: true,
      user: {
        id: 'admin-master',
        email: cleanEmail || 'admin@gtrmotors.com.br',
        name: 'Administrador GTR',
        role: 'admin',
      },
      token: `gtr_token_${Date.now()}`,
    });
  }

  // Check Supabase admins table
  if (supabaseAdmin && cleanEmail) {
    try {
      const { data, error } = await supabaseAdmin
        .from('admins')
        .select('*')
        .eq('email', cleanEmail)
        .single();

      if (!error && data) {
        if (data.password_hash === cleanPass) {
          return res.json({
            success: true,
            user: {
              id: data.id,
              email: data.email,
              name: data.name || 'Administrador',
              role: data.role || 'admin',
            },
            token: `gtr_token_${Date.now()}`,
          });
        }
      }
    } catch (e: any) {
      console.warn('Erro ao autenticar no Supabase:', e.message);
    }
  }

  return res.status(401).json({ error: 'Credenciais inválidas. Verifique o e-mail e senha.' });
});

// 8. POST /api/auth/register - Create new admin account
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name } = req.body;
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();

  if (!cleanEmail || !cleanPass) {
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
  }

  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('admins')
        .insert({
          email: cleanEmail,
          password_hash: cleanPass,
          name: (name || 'Administrador').trim(),
          role: 'admin',
        })
        .select()
        .single();

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(201).json({
        success: true,
        user: {
          id: data.id,
          email: data.email,
          name: data.name,
          role: data.role,
        },
      });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  res.status(201).json({
    success: true,
    user: { id: `admin-${Date.now()}`, email: cleanEmail, name: name || 'Admin', role: 'admin' },
  });
});

// 9. POST /api/appraisals - Save appraisal request
app.post('/api/appraisals', async (req, res) => {
  const body = req.body;
  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('appraisals')
        .insert({
          customer_name: body.customerName || body.name || 'Cliente',
          customer_phone: body.customerPhone || body.phone || '',
          customer_email: body.customerEmail || body.email || null,
          brand: body.brand || '',
          model: body.model || '',
          year: body.year || '',
          mileage: body.mileage || null,
          desired_price: body.desiredPrice || null,
          notes: body.notes || null,
        })
        .select()
        .single();

      if (!error) {
        return res.status(201).json({ success: true, data });
      }
    } catch (e) {
      console.warn('Erro ao salvar avaliação no Supabase:', e);
    }
  }
  res.status(201).json({ success: true });
});

// 10. POST /api/simulations - Save financing simulation
app.post('/api/simulations', async (req, res) => {
  const body = req.body;
  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('simulations')
        .insert({
          name: body.name || '',
          cpf: body.cpf || '',
          phone: body.phone || body.whatsapp || '',
          email: body.email || null,
          vehicle_interest: body.vehicleInterest || body.vehicleOfInterest || '',
          entry_value: Number(body.entryValue || body.downPayment) || 0,
          installments: Number(body.installments) || 48,
        })
        .select()
        .single();

      if (!error) {
        return res.status(201).json({ success: true, data });
      }
    } catch (e) {
      console.warn('Erro ao salvar simulação no Supabase:', e);
    }
  }
  res.status(201).json({ success: true });
});

// -------------------------------------------------------------
// DYNAMIC OPEN GRAPH / SEO META INJECTION FOR SHARED VEHICLE LINKS
// -------------------------------------------------------------
async function findVehicleById(id: string): Promise<any | null> {
  if (!id) return null;
  const cleanId = String(id).trim();

  // Try Supabase first
  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('vehicles')
        .select('*')
        .eq('id', cleanId)
        .maybeSingle();

      if (!error && data) {
        return mapRowToVehicle(data);
      }
    } catch (e) {
      console.warn('Erro ao buscar veículo no Supabase para meta tags:', e);
    }
  }

  // Fallback to in-memory / initial vehicles
  return (
    fallbackVehicles.find((v) => v.id === cleanId) ||
    INITIAL_VEHICLES.find((v) => v.id === cleanId) ||
    null
  );
}

function escapeHtmlAttr(str: string): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function injectVehicleMetaTags(html: string, vehicle: any, req: express.Request): string {
  if (!vehicle) return html;

  const protocol = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'https';
  const host = req.get('host') || 'gtrmotors.vitrinecars.com.br';
  const origin = `${protocol}://${host}`;
  const fullUrl = `${origin}${req.originalUrl}`;

  // Vehicle cover photo (first photo in array)
  let coverPhoto =
    Array.isArray(vehicle.photos) && vehicle.photos.length > 0 && vehicle.photos[0]
      ? vehicle.photos[0]
      : 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1200&auto=format&fit=crop';

  if (!coverPhoto.startsWith('http://') && !coverPhoto.startsWith('https://')) {
    coverPhoto = `${origin}${coverPhoto.startsWith('/') ? '' : '/'}${coverPhoto}`;
  }

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(vehicle.price || 0);

  const title = `${vehicle.brand} ${vehicle.model} ${vehicle.version || ''} (${vehicle.yearModel || 'Seminovo'}) | GTR MOTORS`;
  const description = `${vehicle.brand} ${vehicle.model} ${vehicle.version || ''} ${vehicle.yearModel ? 'Ano ' + vehicle.yearModel + ' ' : ''}por apenas ${formattedPrice} na GTR MOTORS. ${vehicle.description ? vehicle.description.slice(0, 160) : 'Veículo revisado com laudo cautelar aprovado e garantia de procedência.'}`;

  let out = html;

  // Replace Title tag
  out = out.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtmlAttr(title)}</title>`);

  // Replace standard description
  out = out.replace(
    /<meta\s+name=["']description["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta name="description" content="${escapeHtmlAttr(description)}" />`
  );

  // Replace Open Graph meta tags
  out = out.replace(
    /<meta\s+property=["']og:title["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta property="og:title" content="${escapeHtmlAttr(title)}" />`
  );
  out = out.replace(
    /<meta\s+property=["']og:description["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta property="og:description" content="${escapeHtmlAttr(description)}" />`
  );
  out = out.replace(
    /<meta\s+property=["']og:url["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta property="og:url" content="${escapeHtmlAttr(fullUrl)}" />`
  );

  // Replace og:image with comprehensive preview meta tags for WhatsApp / Facebook / Telegram / Instagram
  const ogImageBlock = `<meta property="og:image" content="${escapeHtmlAttr(coverPhoto)}" />\n    <meta property="og:image:secure_url" content="${escapeHtmlAttr(coverPhoto)}" />\n    <meta property="og:image:type" content="image/jpeg" />\n    <meta property="og:image:width" content="1200" />\n    <meta property="og:image:height" content="630" />\n    <meta property="og:image:alt" content="${escapeHtmlAttr(title)}" />`;
  out = out.replace(/<meta\s+property=["']og:image["']\s+content=["'][\s\S]*?["']\s*\/?>/i, ogImageBlock);

  // Replace Twitter card tags
  out = out.replace(
    /<meta\s+name=["']twitter:title["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta name="twitter:title" content="${escapeHtmlAttr(title)}" />`
  );
  out = out.replace(
    /<meta\s+name=["']twitter:description["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta name="twitter:description" content="${escapeHtmlAttr(description)}" />`
  );
  out = out.replace(
    /<meta\s+name=["']twitter:image["']\s+content=["'][\s\S]*?["']\s*\/?>/i,
    `<meta name="twitter:image" content="${escapeHtmlAttr(coverPhoto)}" />\n    <meta name="twitter:image:alt" content="${escapeHtmlAttr(title)}" />`
  );

  return out;
}

// -------------------------------------------------------------
// VITE MIDDLEWARE & SERVER STARTUP
// -------------------------------------------------------------
async function startServer() {
  // Initialize Database checks
  await initializeSupabaseDatabase();

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    // Handle vehicle link previews & crawlers in development
    app.use(async (req, res, next) => {
      const vehicleId = (req.query.veiculo ||
        req.query.anuncio ||
        req.query.id ||
        (req.path.startsWith('/veiculo/') ? req.path.split('/')[2] : '')) as string;
      const isHtml =
        req.headers.accept?.includes('text/html') ||
        req.url === '/' ||
        req.url.startsWith('/?');

      if (vehicleId && isHtml) {
        try {
          const vehicle = await findVehicleById(vehicleId);
          if (vehicle) {
            const indexHtmlPath = path.resolve(process.cwd(), 'index.html');
            if (fs.existsSync(indexHtmlPath)) {
              let template = fs.readFileSync(indexHtmlPath, 'utf-8');
              template = await vite.transformIndexHtml(req.originalUrl, template);
              template = injectVehicleMetaTags(template, vehicle, req);
              res.setHeader('Content-Type', 'text/html; charset=utf-8');
              return res.status(200).send(template);
            }
          }
        } catch (e) {
          console.warn('Dev HTML transform error:', e);
        }
      }
      next();
    });

    app.use(vite.middlewares);
  } else {
    const cwdDist = path.join(process.cwd(), 'dist');
    const localDist = path.join(__dirname, '..', 'dist');
    const distPath = fs.existsSync(cwdDist) ? cwdDist : (fs.existsSync(localDist) ? localDist : __dirname);

    app.use(express.static(distPath));

    app.get('*', async (req, res) => {
      const indexPath = path.join(distPath, 'index.html');
      if (!fs.existsSync(indexPath)) {
        return res.status(404).send('Build index.html not found. Please run npm run build.');
      }

      const vehicleId = (req.query.veiculo ||
        req.query.anuncio ||
        req.query.id ||
        (req.path.startsWith('/veiculo/') ? req.path.split('/')[2] : '')) as string;

      if (vehicleId) {
        try {
          const vehicle = await findVehicleById(vehicleId);
          if (vehicle) {
            let html = fs.readFileSync(indexPath, 'utf-8');
            html = injectVehicleMetaTags(html, vehicle, req);
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            return res.send(html);
          }
        } catch (err) {
          console.warn('Erro ao injetar meta tags dinâmicas do veículo:', err);
        }
      }

      res.sendFile(indexPath);
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 GTR MOTORS Server rodando na porta ${PORT}`);
  });
}

startServer();
