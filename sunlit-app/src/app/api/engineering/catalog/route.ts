import { NextRequest, NextResponse } from 'next/server';
import { searchApplianceCatalog, APPLIANCE_CATALOG } from '@/lib/engineering/catalog/applianceCatalog';
import {
  PV_MODULE_CATALOG,
  INVERTER_CATALOG,
  BATTERY_CATALOG,
  CABLE_CATALOG,
  LOCATION_SOLAR_CATALOG,
} from '@/lib/engineering/catalog/equipmentCatalog';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') ?? 'appliance';
  const query = (searchParams.get('q') ?? '').trim().toLowerCase();
  const category = searchParams.get('category') ?? undefined;

  switch (type) {
    case 'appliance': {
      const results = searchApplianceCatalog(query, category);
      return NextResponse.json({ type: 'appliance', count: results.length, data: results });
    }

    case 'module': {
      const filtered = PV_MODULE_CATALOG.filter(
        (m) =>
          !query ||
          m.manufacturer.toLowerCase().includes(query) ||
          m.model.toLowerCase().includes(query) ||
          `${m.ratedPowerW}W`.toLowerCase().includes(query)
      );
      return NextResponse.json({ type: 'module', count: filtered.length, data: filtered });
    }

    case 'inverter': {
      const filtered = INVERTER_CATALOG.filter(
        (inv) =>
          !query ||
          inv.manufacturer.toLowerCase().includes(query) ||
          inv.model.toLowerCase().includes(query) ||
          `${inv.ratedKva}kva`.toLowerCase().includes(query)
      );
      return NextResponse.json({ type: 'inverter', count: filtered.length, data: filtered });
    }

    case 'battery': {
      const filtered = BATTERY_CATALOG.filter(
        (b) =>
          !query ||
          b.manufacturer.toLowerCase().includes(query) ||
          b.model.toLowerCase().includes(query) ||
          `${b.capacityKwh}kwh`.toLowerCase().includes(query)
      );
      return NextResponse.json({ type: 'battery', count: filtered.length, data: filtered });
    }

    case 'cable': {
      const filtered = CABLE_CATALOG.filter(
        (c) =>
          !query ||
          `${c.crossSectionMm2}mm2`.toLowerCase().includes(query) ||
          c.conductorMaterial.toLowerCase().includes(query)
      );
      return NextResponse.json({ type: 'cable', count: filtered.length, data: filtered });
    }

    case 'location': {
      const filtered = LOCATION_SOLAR_CATALOG.filter(
        (loc) => !query || loc.name.toLowerCase().includes(query) || loc.state.toLowerCase().includes(query)
      );
      return NextResponse.json({ type: 'location', count: filtered.length, data: filtered });
    }

    default:
      return NextResponse.json(
        { error: 'Invalid catalog type. Valid types: appliance, module, inverter, battery, cable, location' },
        { status: 400 }
      );
  }
}
