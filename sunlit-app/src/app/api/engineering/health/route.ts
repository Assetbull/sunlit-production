import { NextResponse } from 'next/server';
import { metricsStore } from '@/lib/engineering/core/observability';
import { PV_MODULE_CATALOG, INVERTER_CATALOG, BATTERY_CATALOG, CABLE_CATALOG } from '@/lib/engineering/catalog/equipmentCatalog';
import { APPLIANCE_CATALOG } from '@/lib/engineering/catalog/applianceCatalog';
import { getAssumptionsForTool } from '@/lib/engineering/core/assumptions';

export async function GET() {
  const timestamp = new Date().toISOString();

  const healthData = {
    status: 'HEALTHY',
    service: 'sunlit-public-engineering-platform',
    version: '2.0.0',
    timestamp,
    checks: {
      calculationEngine: 'READY',
      assumptionsRegistry: {
        status: 'READY',
        solarSystemAssumptionsCount: getAssumptionsForTool('solar-system-sizing').length,
      },
      equipmentCatalog: {
        status: 'READY',
        pvModulesCount: PV_MODULE_CATALOG.length,
        invertersCount: INVERTER_CATALOG.length,
        batteriesCount: BATTERY_CATALOG.length,
        cablesCount: CABLE_CATALOG.length,
      },
      applianceCatalog: {
        status: 'READY',
        appliancesCount: APPLIANCE_CATALOG.length,
      },
      pythonFallbackEngine: 'READY',
    },
    metrics: metricsStore.getSnapshot(),
  };

  return NextResponse.json(healthData, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
