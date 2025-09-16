import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Group, Badge, Progress, Button, Stack, Grid, Alert, Timeline, ActionIcon, Tabs } from '@mantine/core';
import { IconPlayerPlay, IconPlayerPause, IconRefresh, IconAlertTriangle, IconCheck, IconX, IconActivity, IconNetwork, IconSatellite, IconRouter, IconChartLine, IconChartBar } from '@tabler/icons-react';
import { useGlobalContext } from '../context/GlobalContext';

const ScheduleJobs = () => {
  const { showSatellites, showGroundStations } = useGlobalContext();
  const [satellitePositions, setSatellitePositions] = useState([]);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [simulationTime, setSimulationTime] = useState(0);
  const [networkHealth, setNetworkHealth] = useState(100);
  const [activeFailures, setActiveFailures] = useState([]);
  const [mitigationHistory, setMitigationHistory] = useState([]);
  const [networkMetrics, setNetworkMetrics] = useState({
    latency: 45,
    throughput: 95,
    connectivity: 100,
    faultTolerance: 85,
    packetLoss: 0.1,
    jitter: 2.5,
    bandwidthUtilization: 65
  });
  const [faultMatrices, setFaultMatrices] = useState({
    singlePointFailures: 0,
    cascadingFailures: 0,
    recoveryTime: 0,
    reroutedConnections: 0,
    totalReroutes: 0
  });
  const [consoleLogs, setConsoleLogs] = useState([]);
  const [topology, setTopology] = useState({
    nodes: [],
    edges: [],
    kConnectivity: 3,
    algebraicConnectivity: 0.75
  });
  // Generate baseline test data
  const generateBaselineData = () => {
    const baselineData = [];
    for (let i = 0; i < 30; i++) {
      // Create more realistic network patterns
      const timeVariation = i * 0.1;
      const dailyCycle = Math.sin(timeVariation) * 0.3; // Daily usage patterns
      const randomNoise = (Math.random() - 0.5) * 0.1; // Random fluctuations
      
      baselineData.push({
        time: i,
        latency: Math.max(20, 45 + dailyCycle * 15 + Math.sin(i * 0.2) * 8 + Math.random() * 6),
        throughput: Math.min(100, Math.max(70, 95 + dailyCycle * 10 - Math.sin(i * 0.15) * 5 - Math.random() * 4)),
        connectivity: Math.min(100, Math.max(95, 100 + dailyCycle * 2 - Math.sin(i * 0.1) * 1 - Math.random() * 2)),
        packetLoss: Math.max(0, 0.1 + dailyCycle * 0.3 + Math.sin(i * 0.3) * 0.2 + Math.random() * 0.15),
        bandwidthUtilization: Math.min(95, Math.max(30, 65 + dailyCycle * 15 + Math.sin(i * 0.25) * 12 + Math.random() * 8)),
        faultCount: Math.max(0, Math.floor(Math.sin(i * 0.4) * 1.5 + Math.random() * 1.5)),
        recoveryTimes: Math.max(0, Math.sin(i * 0.2) * 2 + Math.random() * 3)
      });
    }
    return baselineData;
  };

  const [historicalData, setHistoricalData] = useState({
    latency: generateBaselineData().map(d => ({ time: d.time, value: d.latency })),
    throughput: generateBaselineData().map(d => ({ time: d.time, value: d.throughput })),
    connectivity: generateBaselineData().map(d => ({ time: d.time, value: d.connectivity })),
    packetLoss: generateBaselineData().map(d => ({ time: d.time, value: d.packetLoss })),
    bandwidthUtilization: generateBaselineData().map(d => ({ time: d.time, value: d.bandwidthUtilization })),
    faultCount: generateBaselineData().map(d => ({ time: d.time, value: d.faultCount })),
    recoveryTimes: generateBaselineData().map(d => ({ time: d.time, value: d.recoveryTimes }))
  });

  const simulationRef = useRef(null);
  const intervalRef = useRef(null);

  const addConsoleLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = {
      id: Date.now(),
      timestamp,
      message,
      type
    };
    setConsoleLogs(prev => [...prev.slice(-49), logEntry]); // Keep last 50 logs
    console.log(`[${timestamp}] ${message}`);
  };

  // Generate mock satellite positions for demonstration
  useEffect(() => {
    const generateMockSatellites = () => {
      const mockSatellites = [];
      for (let i = 0; i < 50; i++) {
        mockSatellites.push({
          name: `STARLINK-${i + 1}`,
          latitude: (Math.random() - 0.5) * 180, // -90 to 90
          longitude: (Math.random() - 0.5) * 360, // -180 to 180
          altitude: 550 + Math.random() * 50 // 550-600 km
        });
      }
      setSatellitePositions(mockSatellites);
    };

    generateMockSatellites();
  }, []);

  // Initialize network topology from existing assets
  useEffect(() => {
    if (satellitePositions && satellitePositions.length > 0) {
      initializeNetworkTopology();
    }
  }, [satellitePositions]);

  const initializeNetworkTopology = () => {
    const nodes = [];
    const edges = [];

    // Add satellite nodes
    satellitePositions.slice(0, 50).forEach((sat, index) => {
      nodes.push({
        id: `sat_${index}`,
        type: 'satellite',
        name: sat.name,
        position: { lat: sat.latitude, lon: sat.longitude, alt: sat.altitude },
        capacity: Math.random() * 1000 + 500, // Mbps
        reliability: 0.95 + Math.random() * 0.05,
        status: 'active'
      });
    });

    // Add ground station nodes (mock data for now)
    const groundStations = [
      { id: 'gs_1', name: 'New York', lat: 40.7128, lon: -74.0060, capacity: 2000 },
      { id: 'gs_2', name: 'London', lat: 51.5074, lon: -0.1278, capacity: 2000 },
      { id: 'gs_3', name: 'Tokyo', lat: 35.6762, lon: 139.6503, capacity: 2000 },
      { id: 'gs_4', name: 'Sydney', lat: -33.8688, lon: 151.2093, capacity: 2000 },
      { id: 'gs_5', name: 'São Paulo', lat: -23.5505, lon: -46.6333, capacity: 2000 }
    ];

    groundStations.forEach(gs => {
      nodes.push({
        id: gs.id,
        type: 'ground_station',
        name: gs.name,
        position: { lat: gs.lat, lon: gs.lon, alt: 0 },
        capacity: gs.capacity,
        reliability: 0.98,
        status: 'active'
      });
    });

    // Create edges based on proximity and connectivity rules
    nodes.forEach(node1 => {
      nodes.forEach(node2 => {
        if (node1.id !== node2.id) {
          const distance = calculateDistance(node1.position, node2.position);
          const maxDistance = node1.type === 'satellite' && node2.type === 'satellite' ? 5000 : 2000;
          
          if (distance <= maxDistance) {
            edges.push({
              id: `${node1.id}_${node2.id}`,
              source: node1.id,
              target: node2.id,
              distance: distance,
              capacity: Math.min(node1.capacity, node2.capacity) * 0.8,
              latency: distance * 0.003, // ms per km
              reliability: Math.min(node1.reliability, node2.reliability),
              status: 'active',
              utilization: Math.random() * 0.7 + 0.1
            });
          }
        }
      });
    });

    setTopology({ nodes, edges, kConnectivity: 3, algebraicConnectivity: 0.75 });
  };

  const calculateDistance = (pos1, pos2) => {
    const R = 6371; // Earth's radius in km
    const lat1 = pos1.lat * Math.PI / 180;
    const lat2 = pos2.lat * Math.PI / 180;
    const deltaLat = (pos2.lat - pos1.lat) * Math.PI / 180;
    const deltaLon = (pos2.lon - pos1.lon) * Math.PI / 180;

    const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(deltaLon/2) * Math.sin(deltaLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    // Add altitude difference for 3D distance
    const altDiff = Math.abs(pos1.alt - pos2.alt);
    return Math.sqrt(distance * distance + altDiff * altDiff);
  };

  const startSimulation = () => {
    setIsSimulationRunning(true);
    setSimulationTime(0);
    setActiveFailures([]);
    setMitigationHistory([]);
    setConsoleLogs([]);
    setFaultMatrices({
      singlePointFailures: 0,
      cascadingFailures: 0,
      recoveryTime: 0,
      reroutedConnections: 0,
      totalReroutes: 0
    });
    
    addConsoleLog('Network simulation started', 'success');
    addConsoleLog('Initializing network topology...', 'info');
    addConsoleLog(`Monitoring ${topology.nodes.length} nodes and ${topology.edges.length} links`, 'info');
    
    // Initialize historical data with baseline data
    setHistoricalData({
      latency: generateBaselineData().map(d => ({ time: d.time, value: d.latency })),
      throughput: generateBaselineData().map(d => ({ time: d.time, value: d.throughput })),
      connectivity: generateBaselineData().map(d => ({ time: d.time, value: d.connectivity })),
      packetLoss: generateBaselineData().map(d => ({ time: d.time, value: d.packetLoss })),
      bandwidthUtilization: generateBaselineData().map(d => ({ time: d.time, value: d.bandwidthUtilization })),
      faultCount: generateBaselineData().map(d => ({ time: d.time, value: d.faultCount })),
      recoveryTimes: generateBaselineData().map(d => ({ time: d.time, value: d.recoveryTimes }))
    });
    
    intervalRef.current = setInterval(() => {
      setSimulationTime(prev => prev + 1);
      simulateNetworkEvents();
    }, 1000);
  };

  const stopSimulation = () => {
    setIsSimulationRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const resetSimulation = () => {
    stopSimulation();
    setSimulationTime(0);
    setNetworkHealth(100);
    setActiveFailures([]);
    setMitigationHistory([]);
    setNetworkMetrics({
      latency: 45,
      throughput: 95,
      connectivity: 100,
      faultTolerance: 85,
      packetLoss: 0.1,
      jitter: 2.5,
      bandwidthUtilization: 65
    });
    setHistoricalData({
      latency: generateBaselineData().map(d => ({ time: d.time, value: d.latency })),
      throughput: generateBaselineData().map(d => ({ time: d.time, value: d.throughput })),
      connectivity: generateBaselineData().map(d => ({ time: d.time, value: d.connectivity })),
      packetLoss: generateBaselineData().map(d => ({ time: d.time, value: d.packetLoss })),
      bandwidthUtilization: generateBaselineData().map(d => ({ time: d.time, value: d.bandwidthUtilization })),
      faultCount: generateBaselineData().map(d => ({ time: d.time, value: d.faultCount })),
      recoveryTimes: generateBaselineData().map(d => ({ time: d.time, value: d.recoveryTimes }))
    });
  };

  const simulateNetworkEvents = () => {
    // Simulate random failures
    if (Math.random() < 0.1 && activeFailures.length < 3) {
      triggerRandomFailure();
    }

    // Simulate mitigation attempts
    if (activeFailures.length > 0 && Math.random() < 0.3) {
      attemptMitigation();
    }

    // Update network metrics
    updateNetworkMetrics();
  };

  const triggerRandomFailure = () => {
    const failureTypes = ['satellite_failure', 'link_failure', 'ground_station_failure', 'congestion'];
    const failureType = failureTypes[Math.floor(Math.random() * failureTypes.length)];
    
    let affectedAsset;
    if (failureType === 'satellite_failure') {
      const satellites = topology.nodes.filter(n => n.type === 'satellite');
      affectedAsset = satellites[Math.floor(Math.random() * satellites.length)];
    } else if (failureType === 'ground_station_failure') {
      const groundStations = topology.nodes.filter(n => n.type === 'ground_station');
      affectedAsset = groundStations[Math.floor(Math.random() * groundStations.length)];
    } else if (failureType === 'link_failure') {
      const links = topology.edges.filter(e => e.status === 'active');
      affectedAsset = links[Math.floor(Math.random() * links.length)];
    }

    const failure = {
      id: `failure_${Date.now()}`,
      type: failureType,
      asset: affectedAsset,
      severity: Math.random() * 0.5 + 0.3, // 0.3 to 0.8
      timestamp: simulationTime,
      impact: {
        latencyIncrease: Math.random() * 50 + 10,
        throughputReduction: Math.random() * 30 + 10,
        connectivityLoss: Math.random() * 20 + 5
      }
    };

    setActiveFailures(prev => [...prev, failure]);
    
    // Update network health
    setNetworkHealth(prev => Math.max(0, prev - failure.impact.connectivityLoss));

    // Log failure details
    const severityPercent = (failure.severity * 100).toFixed(1);
    addConsoleLog(`FAILURE DETECTED: ${failureType.replace('_', ' ').toUpperCase()}`, 'error');
    addConsoleLog(`Asset: ${affectedAsset?.name || 'Unknown'}`, 'error');
    addConsoleLog(`Severity: ${severityPercent}% | Impact: +${failure.impact.latencyIncrease.toFixed(1)}ms latency`, 'error');
    
    // Update fault matrices
    setFaultMatrices(prev => ({
      ...prev,
      singlePointFailures: prev.singlePointFailures + 1,
      totalReroutes: prev.totalReroutes + 1
    }));
  };

  const attemptMitigation = () => {
    if (activeFailures.length === 0) return;

    const failure = activeFailures[0];
    const mitigationSuccess = Math.random() < 0.7; // 70% success rate
    const strategy = getMitigationStrategy(failure.type);
    const recoveryTime = Math.random() * 10 + 5; // 5-15 seconds
    const aiConfidence = Math.random() * 0.3 + 0.6; // 0.6-0.9

    const mitigation = {
      id: `mitigation_${Date.now()}`,
      failureId: failure.id,
      strategy: strategy,
      success: mitigationSuccess,
      timestamp: simulationTime,
      recoveryTime: recoveryTime,
      aiConfidence: aiConfidence
    };

    setMitigationHistory(prev => [...prev, mitigation]);

    // Log mitigation attempt
    addConsoleLog(`MITIGATION ATTEMPT: ${strategy}`, 'warning');
    addConsoleLog(`AI Confidence: ${(aiConfidence * 100).toFixed(1)}% | Target: ${failure.asset?.name || 'Unknown'}`, 'warning');

    if (mitigationSuccess) {
      setActiveFailures(prev => prev.filter(f => f.id !== failure.id));
      setNetworkHealth(prev => Math.min(100, prev + failure.impact.connectivityLoss * 0.8));
      
      // Log successful mitigation
      addConsoleLog(`MITIGATION SUCCESS: ${strategy}`, 'success');
      addConsoleLog(`Recovery Time: ${recoveryTime.toFixed(1)}s | Health Restored: +${(failure.impact.connectivityLoss * 0.8).toFixed(1)}%`, 'success');
      
      // Log rerouting details
      const reroutedConnections = Math.floor(Math.random() * 5) + 1;
      addConsoleLog(`REROUTING: ${reroutedConnections} connections rerouted via backup paths`, 'info');
      addConsoleLog(`New routes established through redundant nodes`, 'info');
      
      // Update fault matrices
      setFaultMatrices(prev => ({
        ...prev,
        reroutedConnections: prev.reroutedConnections + reroutedConnections,
        recoveryTime: prev.recoveryTime + recoveryTime
      }));
    } else {
      // Log failed mitigation
      addConsoleLog(`MITIGATION FAILED: ${strategy}`, 'error');
      addConsoleLog(`Attempting alternative routing strategies...`, 'warning');
      
      // Update fault matrices for failed attempts
      setFaultMatrices(prev => ({
        ...prev,
        cascadingFailures: prev.cascadingFailures + 1
      }));
    }
  };

  const getMitigationStrategy = (failureType) => {
    const strategies = {
      'satellite_failure': 'Satellite redundancy activation',
      'link_failure': 'Dynamic routing optimization',
      'ground_station_failure': 'Traffic rerouting to backup stations',
      'congestion': 'Load balancing and QoS adjustment'
    };
    return strategies[failureType] || 'Unknown strategy';
  };

  const updateNetworkMetrics = () => {
    const failureImpact = activeFailures.reduce((acc, failure) => {
      acc.latency += failure.impact.latencyIncrease;
      acc.throughput -= failure.impact.throughputReduction;
      acc.connectivity -= failure.impact.connectivityLoss;
      return acc;
    }, { latency: 0, throughput: 0, connectivity: 0 });

    const newMetrics = {
      latency: Math.max(20, 45 + failureImpact.latency),
      throughput: Math.max(30, 95 - failureImpact.throughput),
      connectivity: Math.max(50, 100 - failureImpact.connectivity),
      faultTolerance: Math.max(60, 85 - activeFailures.length * 5),
      packetLoss: Math.min(5, activeFailures.length * 0.5 + Math.random() * 0.5),
      jitter: Math.max(1, 2.5 + activeFailures.length * 0.8 + Math.random() * 0.5),
      bandwidthUtilization: Math.min(95, 65 + activeFailures.length * 8 + Math.random() * 5)
    };

    setNetworkMetrics(newMetrics);

    // Store historical data for plotting
    setHistoricalData(prev => ({
      latency: [...prev.latency.slice(-59), { time: simulationTime, value: newMetrics.latency }],
      throughput: [...prev.throughput.slice(-59), { time: simulationTime, value: newMetrics.throughput }],
      connectivity: [...prev.connectivity.slice(-59), { time: simulationTime, value: newMetrics.connectivity }],
      packetLoss: [...prev.packetLoss.slice(-59), { time: simulationTime, value: newMetrics.packetLoss }],
      bandwidthUtilization: [...prev.bandwidthUtilization.slice(-59), { time: simulationTime, value: newMetrics.bandwidthUtilization }],
      faultCount: [...prev.faultCount.slice(-59), { time: simulationTime, value: activeFailures.length }],
      recoveryTimes: [...prev.recoveryTimes.slice(-59), { time: simulationTime, value: faultMatrices.recoveryTime }]
    }));

    // Log significant metric changes
    if (activeFailures.length > 0 && simulationTime % 5 === 0) {
      addConsoleLog(`METRICS UPDATE: Latency: ${newMetrics.latency.toFixed(1)}ms | Throughput: ${newMetrics.throughput.toFixed(1)}% | Packet Loss: ${newMetrics.packetLoss.toFixed(2)}%`, 'info');
    }
  };

  const getHealthColor = (health) => {
    if (health >= 80) return 'green';
    if (health >= 60) return 'yellow';
    return 'red';
  };

  const getMetricColor = (value, type) => {
    if (type === 'latency') {
      return value < 50 ? 'green' : value < 100 ? 'yellow' : 'red';
    }
    if (type === 'bandwidth') {
      return value < 70 ? 'green' : value < 85 ? 'yellow' : 'red';
    }
    if (type === 'jitter') {
      return value < 3 ? 'green' : value < 5 ? 'yellow' : 'red';
    }
    return value > 80 ? 'green' : value > 60 ? 'yellow' : 'red';
  };

  // Simple plot component for metrics
  const SimplePlot = ({ data, title, color = '#2aa9a8', maxValue = 100, unit = '' }) => {
    if (data.length === 0) {
      return (
        <div style={{ height: '120px', position: 'relative', border: '1px solid #333', borderRadius: '4px', padding: '8px' }}>
          <Text size="xs" weight="bold" mb="xs">{title}</Text>
          <Text size="sm" color="dimmed" style={{ textAlign: 'center', marginTop: '20px' }}>No data available</Text>
        </div>
      );
    }
    
    const maxDataValue = Math.max(...data.map(d => d.value), maxValue);
    const minDataValue = Math.min(...data.map(d => d.value), 0);
    const range = maxDataValue - minDataValue || 1; // Avoid division by zero
    
    return (
      <div style={{ height: '120px', position: 'relative', border: '1px solid #333', borderRadius: '4px', padding: '8px' }}>
        <Text size="xs" weight="bold" mb="xs">{title}</Text>
        <svg width="100%" height="80px" style={{ overflow: 'visible' }}>
          {data.map((point, index) => {
            if (index === 0) return null;
            const prevPoint = data[index - 1];
            const maxTime = Math.max(...data.map(d => d.time), 1);
            const x1 = (prevPoint.time / maxTime) * 100;
            const y1 = 100 - ((prevPoint.value - minDataValue) / range) * 100;
            const x2 = (point.time / maxTime) * 100;
            const y2 = 100 - ((point.value - minDataValue) / range) * 100;
            
            return (
              <line
                key={index}
                x1={`${x1}%`}
                y1={`${y1}%`}
                x2={`${x2}%`}
                y2={`${y2}%`}
                stroke={color}
                strokeWidth="2"
              />
            );
          })}
        </svg>
        <div style={{ position: 'absolute', bottom: '4px', right: '8px' }}>
          <Text size="xs" color="dimmed">
            {data[data.length - 1]?.value.toFixed(1)}{unit}
          </Text>
        </div>
      </div>
    );
  };

  // Capacity utilization plot
  const CapacityPlot = () => {
    let capacityData = topology.edges.map(edge => ({
      name: `${edge.source} → ${edge.target}`,
      utilization: edge.utilization * 100,
      capacity: edge.capacity
    })).slice(0, 10); // Show top 10 connections
    
    // If no real data, show mock data
    if (capacityData.length === 0) {
      capacityData = [
        { name: 'SAT-001 → SAT-002', utilization: 45 + Math.random() * 20, capacity: 1000 },
        { name: 'SAT-003 → SAT-004', utilization: 60 + Math.random() * 15, capacity: 1000 },
        { name: 'SAT-005 → GS-001', utilization: 35 + Math.random() * 25, capacity: 1000 },
        { name: 'SAT-006 → SAT-007', utilization: 70 + Math.random() * 10, capacity: 1000 },
        { name: 'SAT-008 → GS-002', utilization: 55 + Math.random() * 20, capacity: 1000 },
        { name: 'SAT-009 → SAT-010', utilization: 40 + Math.random() * 30, capacity: 1000 },
        { name: 'SAT-011 → SAT-012', utilization: 65 + Math.random() * 15, capacity: 1000 },
        { name: 'SAT-013 → GS-003', utilization: 50 + Math.random() * 25, capacity: 1000 }
      ];
    }
    
    return (
      <div style={{ height: '200px', overflowY: 'auto' }}>
        <Text size="sm" weight="bold" mb="sm">Link Capacity Utilization</Text>
        {capacityData.map((link, index) => (
          <div key={index} style={{ marginBottom: '8px' }}>
            <Group position="apart" mb="xs">
              <Text size="xs" style={{ fontFamily: 'monospace' }}>{link.name}</Text>
              <Text size="xs" color="dimmed">{link.utilization.toFixed(1)}%</Text>
            </Group>
            <Progress 
              value={link.utilization} 
              color={link.utilization > 80 ? 'red' : link.utilization > 60 ? 'yellow' : 'green'}
              size="sm"
            />
          </div>
        ))}
      </div>
    );
  };

  // Fault matrix visualization
  const FaultMatrixPlot = () => {
    const matrixData = [
      { type: 'Single Point', count: faultMatrices.singlePointFailures, color: '#ff6b6b' },
      { type: 'Cascading', count: faultMatrices.cascadingFailures, color: '#ffd93d' },
      { type: 'Rerouted', count: faultMatrices.reroutedConnections, color: '#6bcf7f' },
      { type: 'Total Events', count: faultMatrices.totalReroutes, color: '#4dabf7' }
    ];
    
    const maxCount = Math.max(...matrixData.map(d => d.count), 1);
    
    return (
      <div>
        <Text size="sm" weight="bold" mb="sm">Fault Event Distribution</Text>
        {matrixData.map((item, index) => (
          <div key={index} style={{ marginBottom: '12px' }}>
            <Group position="apart" mb="xs">
              <Text size="xs">{item.type}</Text>
              <Text size="xs" weight="bold">{item.count}</Text>
            </Group>
            <div style={{ 
              height: '20px', 
              backgroundColor: '#333', 
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${(item.count / maxCount) * 100}%`,
                backgroundColor: item.color,
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Stack spacing="lg">
        {/* Header */}
        <Card>
          <Group position="apart">
            <div>
              <Text size="xl" weight="bold">Network Failure Mitigation Simulation</Text>
              
            </div>
            <Group>
              <Button
                leftIcon={isSimulationRunning ? <IconPlayerPause size={16} /> : <IconPlayerPlay size={16} />}
                onClick={isSimulationRunning ? stopSimulation : startSimulation}
                color={isSimulationRunning ? 'orange' : 'green'}
              >
                {isSimulationRunning ? 'Pause' : 'Start'} Simulation
              </Button>
              <Button
                leftIcon={<IconRefresh size={16} />}
                onClick={resetSimulation}
                variant="outline"
              >
                Reset
              </Button>
              <Button
                onClick={() => {
                  // Add test data point
                  const testData = {
                    latency: 45 + Math.random() * 20,
                    throughput: 95 - Math.random() * 10,
                    connectivity: 100 - Math.random() * 5,
                    packetLoss: 0.1 + Math.random() * 0.5,
                    bandwidthUtilization: 65 + Math.random() * 15
                  };
                  setNetworkMetrics(testData);
                  setHistoricalData(prev => {
                    const currentTime = Math.max(...prev.latency.map(d => d.time), 0) + 1;
                    return {
                      latency: [...prev.latency.slice(-29), { time: currentTime, value: testData.latency }],
                      throughput: [...prev.throughput.slice(-29), { time: currentTime, value: testData.throughput }],
                      connectivity: [...prev.connectivity.slice(-29), { time: currentTime, value: testData.connectivity }],
                      packetLoss: [...prev.packetLoss.slice(-29), { time: currentTime, value: testData.packetLoss }],
                      bandwidthUtilization: [...prev.bandwidthUtilization.slice(-29), { time: currentTime, value: testData.bandwidthUtilization }],
                      faultCount: [...prev.faultCount.slice(-29), { time: currentTime, value: Math.floor(Math.random() * 3) }],
                      recoveryTimes: [...prev.recoveryTimes.slice(-29), { time: currentTime, value: Math.random() * 10 }]
                    };
                  });
                  addConsoleLog('Test data point added', 'info');
                }}
                variant="outline"
                color="blue"
              >
                Add Test Data
              </Button>
            </Group>
          </Group>
        </Card>

        {/* Network Overview */}
        <Grid>
          <Grid.Col span={6}>
            <Card>
              <Text size="lg" weight="bold" mb="md">Network Topology</Text>
              <Stack spacing="sm">
                <Group position="apart">
                  <Text size="sm">Total Nodes:</Text>
                  <Badge color="blue">{topology.nodes.length}</Badge>
                </Group>
                <Group position="apart">
                  <Text size="sm">Active Links:</Text>
                  <Badge color="green">{topology.edges.filter(e => e.status === 'active').length}</Badge>
                </Group>
                <Group position="apart">
                  <Text size="sm">K-Connectivity:</Text>
                  <Badge color="purple">{topology.kConnectivity}</Badge>
                </Group>
                <Group position="apart">
                  <Text size="sm">Algebraic Connectivity:</Text>
                  <Badge color="cyan">{topology.algebraicConnectivity.toFixed(3)}</Badge>
                </Group>
              </Stack>
            </Card>
          </Grid.Col>
          
          <Grid.Col span={6}>
            <Card>
              <Text size="lg" weight="bold" mb="md">Network Health</Text>
              <Stack spacing="sm">
                <Group position="apart">
                  <Text size="sm">Overall Health:</Text>
                  <Badge color={getHealthColor(networkHealth)}>{networkHealth.toFixed(1)}%</Badge>
                </Group>
                <Progress value={networkHealth} color={getHealthColor(networkHealth)} size="lg" />
                <Group position="apart">
                  <Text size="sm">Simulation Time:</Text>
                  <Badge color="gray">{simulationTime}s</Badge>
                </Group>
                <Group position="apart">
                  <Text size="sm">Active Failures:</Text>
                  <Badge color="red">{activeFailures.length}</Badge>
                </Group>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Analytics Dashboard */}
        <Card>
          <Text size="lg" weight="bold" mb="md">Network Analytics Dashboard</Text>
          <Tabs defaultValue="metrics">
            <Tabs.List>
              <Tabs.Tab value="metrics" icon={<IconChartLine size={16} />}>Performance Metrics</Tabs.Tab>
              <Tabs.Tab value="capacity" icon={<IconChartBar size={16} />}>Capacity Analysis</Tabs.Tab>
              <Tabs.Tab value="faults" icon={<IconAlertTriangle size={16} />}>Fault Matrices</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="metrics" pt="md">
              <Grid>
                <Grid.Col span={6}>
                  <SimplePlot 
                    data={historicalData.latency} 
                    title="Latency Trend" 
                    color="#ff6b6b" 
                    maxValue={200} 
                    unit="ms" 
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <SimplePlot 
                    data={historicalData.throughput} 
                    title="Throughput Trend" 
                    color="#6bcf7f" 
                    maxValue={100} 
                    unit="%" 
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <SimplePlot 
                    data={historicalData.connectivity} 
                    title="Connectivity Trend" 
                    color="#4dabf7" 
                    maxValue={100} 
                    unit="%" 
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <SimplePlot 
                    data={historicalData.packetLoss} 
                    title="Packet Loss Trend" 
                    color="#ffd93d" 
                    maxValue={10} 
                    unit="%" 
                  />
                </Grid.Col>
              </Grid>
            </Tabs.Panel>

            <Tabs.Panel value="capacity" pt="md">
              <Grid>
                <Grid.Col span={8}>
                  <CapacityPlot />
                </Grid.Col>
                <Grid.Col span={4}>
                  <Stack spacing="md">
                    <div style={{ textAlign: 'center' }}>
                      <Text size="sm" weight="bold">Bandwidth Utilization</Text>
                      <Text size="xl" color={getMetricColor(networkMetrics.bandwidthUtilization, 'bandwidth')}>
                        {networkMetrics.bandwidthUtilization.toFixed(1)}%
                      </Text>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <Text size="sm" weight="bold">Jitter</Text>
                      <Text size="xl" color={getMetricColor(networkMetrics.jitter, 'jitter')}>
                        {networkMetrics.jitter.toFixed(1)}ms
                      </Text>
                    </div>
                    <SimplePlot 
                      data={historicalData.bandwidthUtilization} 
                      title="Bandwidth Trend" 
                      color="#2aa9a8" 
                      maxValue={100} 
                      unit="%" 
                    />
                  </Stack>
                </Grid.Col>
              </Grid>
            </Tabs.Panel>

            <Tabs.Panel value="faults" pt="md">
              <Grid>
                <Grid.Col span={6}>
                  <FaultMatrixPlot />
                </Grid.Col>
                <Grid.Col span={6}>
                  <Stack spacing="md">
                    <div style={{ textAlign: 'center' }}>
                      <Text size="sm" weight="bold">Active Failures</Text>
                      <Text size="xl" color={activeFailures.length > 0 ? 'red' : 'green'}>
                        {activeFailures.length}
                      </Text>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <Text size="sm" weight="bold">Success Rate</Text>
                      <Text size="xl" color={mitigationHistory.length > 0 && mitigationHistory.filter(m => m.success).length / mitigationHistory.length > 0.7 ? 'green' : 'yellow'}>
                        {mitigationHistory.length > 0 
                          ? ((mitigationHistory.filter(m => m.success).length / mitigationHistory.length) * 100).toFixed(1) + '%'
                          : '0%'
                        }
                      </Text>
                    </div>
                    <SimplePlot 
                      data={historicalData.faultCount} 
                      title="Fault Count Trend" 
                      color="#ff6b6b" 
                      maxValue={10} 
                      unit="" 
                    />
                  </Stack>
                </Grid.Col>
              </Grid>
            </Tabs.Panel>
          </Tabs>
        </Card>

        {/* Console Logs */}
        <Card>
          <Text size="lg" weight="bold" mb="md">Network Operations Console</Text>
          <div style={{ 
            height: '300px', 
            overflowY: 'auto', 
            backgroundColor: '#0a0a0a', 
            padding: '12px', 
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '12px'
          }}>
            {consoleLogs.length === 0 ? (
              <Text size="sm" color="dimmed">Console ready... Start simulation to see network operations.</Text>
            ) : (
              consoleLogs.map(log => (
                <div key={log.id} style={{ 
                  marginBottom: '4px',
                  color: log.type === 'error' ? '#ff6b6b' : 
                         log.type === 'warning' ? '#ffd93d' : 
                         log.type === 'success' ? '#6bcf7f' : '#ffffff'
                }}>
                  <span style={{ color: '#888' }}>[{log.timestamp}]</span> {log.message}
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Active Failures */}
        {activeFailures.length > 0 && (
          <Card>
            <Text size="lg" weight="bold" mb="md">Active Failures</Text>
            <Stack spacing="sm">
              {activeFailures.map(failure => (
                <Alert
                  key={failure.id}
                  icon={<IconAlertTriangle size={16} />}
                  title={`${failure.type.replace('_', ' ').toUpperCase()}`}
                  color="red"
                >
                  <Group position="apart">
                    <div>
                      <Text size="sm">
                        <strong>Asset:</strong> {failure.asset?.name || 'Unknown'}
                      </Text>
                      <Text size="sm">
                        <strong>Severity:</strong> {(failure.severity * 100).toFixed(1)}%
                      </Text>
                      <Text size="sm">
                        <strong>Impact:</strong> +{failure.impact.latencyIncrease.toFixed(1)}ms latency, 
                        -{failure.impact.throughputReduction.toFixed(1)}% throughput
                      </Text>
                    </div>
                    <Badge color="red">Active</Badge>
                  </Group>
                </Alert>
              ))}
            </Stack>
          </Card>
        )}

        {/* Mitigation History */}
        <Card>
          <Text size="lg" weight="bold" mb="md">Mitigation History</Text>
          <Timeline active={mitigationHistory.length}>
            {mitigationHistory.slice(-10).map(mitigation => (
              <Timeline.Item
                key={mitigation.id}
                bullet={mitigation.success ? <IconCheck size={12} /> : <IconX size={12} />}
                title={mitigation.strategy}
                color={mitigation.success ? 'green' : 'red'}
              >
                <Text size="sm" color="dimmed">
                  {mitigation.success ? 'Successfully mitigated' : 'Mitigation failed'} at {mitigation.timestamp}s
                </Text>
                <Text size="xs" color="dimmed">
                  AI Confidence: {(mitigation.aiConfidence * 100).toFixed(1)}% | 
                  Recovery Time: {mitigation.recoveryTime.toFixed(1)}s
                </Text>
              </Timeline.Item>
            ))}
          </Timeline>
        </Card>
      </Stack>
    </div>
  );
};

export default ScheduleJobs;
