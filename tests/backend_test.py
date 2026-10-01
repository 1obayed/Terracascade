import unittest
from fastapi.testclient import TestClient
from backend.main import app, EVENTS
from backend.engine import forecast
from backend.validate_processed import validate


class ApiTests(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_health_and_catalog(self):
        self.assertFalse(self.client.get('/health').json()['liveNisarConnected'])
        self.assertEqual(len(self.client.get('/events').json()), 4)

    def test_missing_event(self):
        self.assertEqual(self.client.get('/events/missing').status_code, 404)

    def test_forecast_baseline(self):
        response = self.client.post('/forecast', json={'eventId': 'jakarta', 'scenario': {'horizon': 60}})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['dataStatus'], 'ILLUSTRATIVE')
        result = response.json()['result']
        self.assertAlmostEqual(result['slope'], -.6527777777777778)
        self.assertAlmostEqual(result['points'][-1]['value'], -66.16666666666667)
        self.assertEqual(result['thresholdWindow'], [43, 61])

    def test_input_bounds(self):
        for scenario in ({'rainfall': 120}, {'horizon': 365}, {'moisture': -1}, {'unexpected': 3}):
            self.assertEqual(self.client.post('/forecast', json={'eventId': 'jakarta', 'scenario': scenario}).status_code, 422)

    def test_evidence(self):
        evidence = self.client.get('/events/jakarta/evidence').json()
        self.assertEqual(evidence[0]['type'], 'OBSERVED')
        self.assertTrue(all(e['status'] == 'ILLUSTRATIVE' for e in evidence))

    def test_scenario_equivalence(self):
        payload = {'eventId': 'alaska', 'scenario': {'acceleration': 75, 'horizon': 90}}
        self.assertEqual(self.client.post('/forecast', json=payload).json(), self.client.post('/scenario', json=payload).json())

    def test_cors_disallows_unknown_origin(self):
        response = self.client.options('/forecast', headers={'Origin': 'https://untrusted.example', 'Access-Control-Request-Method': 'POST'})
        self.assertNotIn('access-control-allow-origin', response.headers)

    def test_ingestion_does_not_upgrade_to_verified(self):
        record = {**EVENTS[0], 'processingVersion': 'demo-v1', 'crs': 'EPSG:4326', 'referenceConvention': 'illustrative LOS'}
        self.assertFalse(validate(record)['scientificallyVerifiedByValidator'])
        record['status'] = 'VERIFIED'
        with self.assertRaises(ValueError):
            validate(record)


if __name__ == '__main__':
    unittest.main()
