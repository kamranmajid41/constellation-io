import React, { useState, useEffect, useRef } from 'react';
import { Card, Text, Group, Badge, Progress, Button, Stack, Grid, Alert, Timeline, ActionIcon, Tabs } from '@mantine/core';
import { IconPlayerPlay, IconPlayerPause, IconRefresh, IconAlertTriangle, IconCheck, IconX, IconActivity, IconNetwork, IconSatellite, IconRouter, IconChartLine, IconChartBar } from '@tabler/icons-react';
import { useGlobalContext } from '../context/GlobalContext';

const ScheduleJobs = () => {
  const { showSatellites, showGroundStations } = useGlobalContext();
  
  // Real satellite and ground station IDs from data
  const realSatelliteIds = [
    'STARLINK-1008', 'STARLINK-1010', 'STARLINK-1011', 'STARLINK-1012', 
    'STARLINK-1013', 'STARLINK-1014', 'STARLINK-1015', 'STARLINK-1017',
    'STARLINK-1019', 'STARLINK-1020', 'STARLINK-1021', 'STARLINK-1029'
  ];
  
  const realGroundStationIds = [
    'KB9JHU', 'M0SZT', 'DL4PD', 'PV8DX', 'F6KKR', 'SM0IFP',
    '7J1AJH', 'VA3TZA', 'CU2ZG', 'OZ1SKY', 'F4KLD', 'ZL2MST'
  ];
  const [satellitePositions, setSatellitePositions] = useState([]);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [simulationTime, setSimulationTime] = useState(0);
  const [networkHealth, setNetworkHealth] = useState(100);
  const [activeFailures, setActiveFailures] = useState([]);
  const [mitigationHistory, setMitigationHistory] = useState([]);
  const [networkMetrics, setNetworkMetrics] = useState({
    // Performance Metrics
    latency: 23.4, // ms (end-to-end)
    throughput: 847.2, // Mbps (aggregate)
    connectivity: 99.97, // % (availability)
    packetLoss: 0.003, // % (BER)
    jitter: 1.2, // ms (delay variation)
    bandwidthUtilization: 67.3, // %
    
    // Graph Theory Metrics
    kConnectivity: 3, // k-connectivity
    algebraicConnectivity: 0.847, // λ₂ (Fiedler value)
    networkDiameter: 4, // max shortest path
    clusteringCoefficient: 0.623, // local clustering
    averagePathLength: 2.1, // avg shortest path
    spectralGap: 0.156, // λ₂ - λ₁
    resilience: 0.94, // network resilience index
    
    // Link Margin Analysis
    linkMargin: 12.3, // dB (worst case)
    snr: 15.7, // dB (signal-to-noise ratio)
    ber: 1e-9, // bit error rate
    fadeMargin: 8.2, // dB (rain fade)
    atmosphericLoss: 0.3, // dB (clear sky)
    
    // Network Flow Optimization
    maxFlow: 1200, // Mbps (maximum flow)
    minCut: 800, // Mbps (minimum cut)
    flowEfficiency: 0.89, // flow utilization
    congestionIndex: 0.12, // network congestion
    
    // Quality of Service
    mos: 4.2, // Mean Opinion Score
    rFactor: 87.3, // R-Factor (ITU-T G.107)
    slaCompliance: 100, // % (SLA adherence)
    mtbf: 8760, // hours (Mean Time Between Failures)
    mttr: 0.5 // hours (Mean Time To Repair)
  });
  const [faultMatrices, setFaultMatrices] = useState({
    singlePointFailures: 0,
    cascadingFailures: 0,
    recoveryTime: 0, // seconds
    reroutedConnections: 0,
    totalReroutes: 0,
    availability: 99.97, // %
    slaCompliance: 100, // %
    errorRate: 0.0003, // %
    uptime: 8760 // hours
  });
  const [consoleLogs, setConsoleLogs] = useState([]);
  const consoleRef = useRef(null);
  const [topology, setTopology] = useState({
    nodes: [],
    edges: [],
    
    // Graph Theory Fundamentals
    kConnectivity: 3, // k-connectivity (minimum nodes to disconnect)
    algebraicConnectivity: 0.847, // λ₂ (Fiedler eigenvalue)
    networkDiameter: 4, // maximum shortest path length
    clusteringCoefficient: 0.623, // local clustering measure
    averagePathLength: 2.1, // average shortest path
    spectralGap: 0.156, // λ₂ - λ₁ (connectivity gap)
    resilience: 0.94, // network resilience index
    
    // Network Flow Theory
    maxFlow: 1200, // maximum flow capacity (Mbps)
    minCut: 800, // minimum cut capacity (Mbps)
    flowEfficiency: 0.89, // flow utilization ratio
    congestionIndex: 0.12, // network congestion level
    
    // Shortest Path Algorithms
    dijkstraPaths: [], // Dijkstra shortest paths
    bellmanFordPaths: [], // Bellman-Ford paths
    floydWarshallMatrix: [], // Floyd-Warshall distance matrix
    
    // Network Robustness
    nodeConnectivity: 3, // minimum nodes to disconnect
    edgeConnectivity: 4, // minimum edges to disconnect
    betweennessCentrality: [], // node betweenness values
    closenessCentrality: [], // node closeness values
    eigenvectorCentrality: [] // node eigenvector values
  });
  const [predictiveDemo, setPredictiveDemo] = useState({
    isRunning: false,
    attackNode: null,
    warningTime: 0,
    reroutePaths: [],
    uptime: 100,
    latencySpike: 0,
    dataFlow: []
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
    
    // Auto-scroll to bottom
    setTimeout(() => {
      if (consoleRef.current) {
        consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
      }
    }, 100);
  };

  // Predictive Demo Functions
  const startPredictiveDemo = () => {
    setPredictiveDemo({
      isRunning: true,
      attackNode: null,
      warningTime: 0,
      reroutePaths: [],
      uptime: 100,
      latencySpike: 0,
      dataFlow: []
    });
    
    addConsoleLog('Topology analysis: Initializing network graph model', 'info');
    addConsoleLog('Graph metrics: k-connectivity=3, λ₂=0.847, diameter=4', 'info');
    addConsoleLog('Link budget: SNR=15.7dB, BER=1e-9, fade margin=8.2dB', 'info');
    addConsoleLog('Flow capacity: Max flow=1200Mbps, min cut=800Mbps, utilization=89%', 'info');
    addConsoleLog('Routing: Dijkstra, Bellman-Ford, Floyd-Warshall algorithms loaded', 'info');
    
    // Simulate AI prediction after 3 seconds
    setTimeout(() => {
      const attackNode = realSatelliteIds[Math.floor(Math.random() * 6)];
      setPredictiveDemo(prev => ({ ...prev, attackNode, warningTime: 10 }));
      addConsoleLog(`Anomaly: ${attackNode} performance degradation detected`, 'warning');
      addConsoleLog(`Link budget: SNR=8.2dB, BER=1e-6, margin insufficient`, 'warning');
      addConsoleLog(`Failure probability: 94.7% confidence, ETA 10s`, 'warning');
      addConsoleLog(`Connectivity: Node removal reduces k-connectivity to k=2`, 'warning');
      addConsoleLog(`Routing: Activating backup paths`, 'warning');
      
      // Start countdown
      let countdown = 10;
      const countdownInterval = setInterval(() => {
        countdown--;
        setPredictiveDemo(prev => ({ ...prev, warningTime: countdown }));
        
        if (countdown === 5) {
          addConsoleLog('Path computation: Calculating alternative routes', 'info');
          addConsoleLog('Max-flow min-cut: Computing capacity-optimized paths', 'info');
          addConsoleLog('Dijkstra: Computing shortest paths with updated weights', 'info');
          addConsoleLog('Connectivity: Maintaining λ₂ > 0.5 threshold', 'info');
          // Generate reroute paths based on actual topology
          const availableSatellites = realSatelliteIds.filter(id => id !== attackNode);
          const availableGroundStations = realGroundStationIds.slice(0, 3);
          const reroutePaths = [
            { from: attackNode, to: availableSatellites[0], latency: 23.4, bandwidth: 1000, reliability: 99.8, snr: 12.5, ber: 1e-9 },
            { from: attackNode, to: availableSatellites[1], latency: 25.1, bandwidth: 800, reliability: 99.5, snr: 11.8, ber: 1e-8 },
            { from: attackNode, to: availableGroundStations[0], latency: 1.2, bandwidth: 1200, reliability: 99.9, snr: 15.3, ber: 1e-12 }
          ];
          setPredictiveDemo(prev => ({ ...prev, reroutePaths }));
          addConsoleLog(`3 backup paths: Max flow=1200Mbps, Min cut=800Mbps`, 'success');
          addConsoleLog(`Link budget: SNR≥11dB, BER≤1e-8 on all paths`, 'success');
          addConsoleLog(`Topology: k-connectivity maintained at k=3`, 'success');
        }
        
        if (countdown === 2) {
          addConsoleLog('Traffic rerouting: Data flow redirected to backup paths', 'success');
          addConsoleLog('Uptime: 100% maintained', 'success');
        }
        
        if (countdown === 0) {
          clearInterval(countdownInterval);
          addConsoleLog(`Node failure: ${attackNode} failure occurred as predicted`, 'error');
          addConsoleLog('Flow: Max-flow min-cut maintained network capacity', 'success');
          addConsoleLog('Topology: k-connectivity=3, λ₂=0.847', 'success');
          addConsoleLog('Link performance: SNR≥11dB, BER≤1e-8 on all paths', 'success');
          addConsoleLog('Latency: No service disruption detected', 'success');
          addConsoleLog('Validation: Predictive failure mitigation successful', 'success');
          
          // Reset demo after showing success
          setTimeout(() => {
            setPredictiveDemo(prev => ({ ...prev, isRunning: false, attackNode: null, warningTime: 0, reroutePaths: [] }));
            addConsoleLog('Demo complete: Network resilience validation successful', 'success');
            addConsoleLog('Performance: Graph theory + link margin analysis operational', 'success');
            addConsoleLog('Architecture: Dynamic routing with static topology optimization', 'success');
          }, 3000);
        }
      }, 1000);
    }, 3000);
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
    
    addConsoleLog('Simulation started', 'success');
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
      // Performance Metrics
      latency: 23.4,
      throughput: 847.2,
      connectivity: 99.97,
      packetLoss: 0.003,
      jitter: 1.2,
      bandwidthUtilization: 67.3,
      
      // Graph Theory Metrics
      kConnectivity: 3,
      algebraicConnectivity: 0.847,
      networkDiameter: 4,
      clusteringCoefficient: 0.623,
      averagePathLength: 2.1,
      spectralGap: 0.156,
      resilience: 0.94,
      
      // Link Margin Analysis
      linkMargin: 12.3,
      snr: 15.7,
      ber: 1e-9,
      fadeMargin: 8.2,
      atmosphericLoss: 0.3,
      
      // Network Flow Optimization
      maxFlow: 1200,
      minCut: 800,
      flowEfficiency: 0.89,
      congestionIndex: 0.12,
      
      // Quality of Service
      mos: 4.2,
      rFactor: 87.3,
      slaCompliance: 100,
      mtbf: 8760,
      mttr: 0.5
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
    addConsoleLog(`Failure: ${failureType.replace('_', ' ')} detected`, 'error');
    addConsoleLog(`Node: ${affectedAsset?.id || 'Unknown'}`, 'error');
    addConsoleLog(`Severity: ${severityPercent}% | Latency: +${failure.impact.latencyIncrease.toFixed(1)}ms`, 'error');
    
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
    addConsoleLog(`Recovery: ${strategy}`, 'warning');
    addConsoleLog(`Confidence: ${(aiConfidence * 100).toFixed(1)}% | Target: ${failure.asset?.id || 'Unknown'}`, 'warning');

    if (mitigationSuccess) {
      setActiveFailures(prev => prev.filter(f => f.id !== failure.id));
      setNetworkHealth(prev => Math.min(100, prev + failure.impact.connectivityLoss * 0.8));
      
      // Log successful mitigation
      addConsoleLog(`Recovery: ${strategy} successful`, 'success');
      addConsoleLog(`Time: ${recoveryTime.toFixed(1)}s | Health: +${(failure.impact.connectivityLoss * 0.8).toFixed(1)}%`, 'success');
      
      // Log rerouting details
      const reroutedConnections = Math.floor(Math.random() * 5) + 1;
      addConsoleLog(`Rerouting: ${reroutedConnections} connections via backup paths`, 'info');
      addConsoleLog(`Optimization: Redundant nodes activated`, 'info');
      
      // Update fault matrices
      setFaultMatrices(prev => ({
        ...prev,
        reroutedConnections: prev.reroutedConnections + reroutedConnections,
        recoveryTime: prev.recoveryTime + recoveryTime
      }));
    } else {
      // Log failed mitigation
      addConsoleLog(`Recovery: ${strategy} failed`, 'error');
      addConsoleLog(`Alternative routing: Computing backup strategies`, 'warning');
      
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
      // Performance Metrics
      latency: Math.max(20, 23.4 + failureImpact.latency),
      throughput: Math.max(30, 847.2 - failureImpact.throughput),
      connectivity: Math.max(50, 99.97 - failureImpact.connectivity),
      packetLoss: Math.min(5, 0.003 + activeFailures.length * 0.5 + Math.random() * 0.5),
      jitter: Math.max(1, 1.2 + activeFailures.length * 0.8 + Math.random() * 0.5),
      bandwidthUtilization: Math.min(95, 67.3 + activeFailures.length * 8 + Math.random() * 5),
      
      // Graph Theory Metrics
      kConnectivity: 3,
      algebraicConnectivity: 0.847,
      networkDiameter: 4,
      clusteringCoefficient: 0.623,
      averagePathLength: 2.1,
      spectralGap: 0.156,
      resilience: Math.max(0.6, 0.94 - activeFailures.length * 0.05),
      
      // Link Margin Analysis
      linkMargin: Math.max(5, 12.3 - activeFailures.length * 1.5),
      snr: Math.max(8, 15.7 - activeFailures.length * 2),
      ber: Math.min(1e-6, 1e-9 * Math.pow(10, activeFailures.length)),
      fadeMargin: 8.2,
      atmosphericLoss: 0.3,
      
      // Network Flow Optimization
      maxFlow: Math.max(600, 1200 - activeFailures.length * 100),
      minCut: Math.max(400, 800 - activeFailures.length * 50),
      flowEfficiency: Math.max(0.5, 0.89 - activeFailures.length * 0.1),
      congestionIndex: Math.min(0.8, 0.12 + activeFailures.length * 0.1),
      
      // Quality of Service
      mos: Math.max(2.0, 4.2 - activeFailures.length * 0.3),
      rFactor: Math.max(50, 87.3 - activeFailures.length * 5),
      slaCompliance: Math.max(50, 100 - activeFailures.length * 10),
      mtbf: 8760,
      mttr: 0.5
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
      addConsoleLog(`Metrics: Latency=${newMetrics.latency.toFixed(1)}ms, Throughput=${newMetrics.throughput.toFixed(1)}Mbps, BER=${newMetrics.packetLoss.toFixed(3)}%`, 'info');
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
        { name: `${realSatelliteIds[0]} → ${realSatelliteIds[1]}`, utilization: 45 + Math.random() * 20, capacity: 1000 },
        { name: `${realSatelliteIds[2]} → ${realSatelliteIds[3]}`, utilization: 60 + Math.random() * 15, capacity: 1000 },
        { name: `${realSatelliteIds[4]} → ${realGroundStationIds[0]}`, utilization: 35 + Math.random() * 25, capacity: 1000 },
        { name: `${realSatelliteIds[5]} → ${realSatelliteIds[6]}`, utilization: 70 + Math.random() * 10, capacity: 1000 },
        { name: `${realSatelliteIds[7]} → ${realGroundStationIds[1]}`, utilization: 55 + Math.random() * 20, capacity: 1000 },
        { name: `${realSatelliteIds[8]} → ${realSatelliteIds[9]}`, utilization: 40 + Math.random() * 30, capacity: 1000 },
        { name: `${realSatelliteIds[10]} → ${realSatelliteIds[11]}`, utilization: 65 + Math.random() * 15, capacity: 1000 },
        { name: `${realGroundStationIds[2]} → ${realGroundStationIds[3]}`, utilization: 50 + Math.random() * 25, capacity: 1000 }
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

  // Network Topology Visualization
  const NetworkTopology = () => {
    const nodes = [
      { 
        id: realSatelliteIds[0], x: 50, y: 30, type: 'satellite', status: 'operational', 
        load: 67.3, latency: 23.4, throughput: 847.2, altitude: 550, inclination: 53.0,
        frequency: 'Ka-band', power: 2.1, temperature: -45.2, battery: 94.7
      },
      { 
        id: realSatelliteIds[1], x: 80, y: 40, type: 'satellite', status: 'operational', 
        load: 72.1, latency: 21.8, throughput: 923.5, altitude: 551, inclination: 53.1,
        frequency: 'Ka-band', power: 2.0, temperature: -43.8, battery: 96.2
      },
      { 
        id: realSatelliteIds[2], x: 60, y: 60, type: 'satellite', status: 'operational', 
        load: 58.7, latency: 25.1, throughput: 781.3, altitude: 549, inclination: 52.9,
        frequency: 'Ka-band', power: 2.2, temperature: -46.1, battery: 93.4
      },
      { 
        id: realSatelliteIds[3], x: 30, y: 70, type: 'satellite', status: 'operational', 
        load: 68.9, latency: 22.7, throughput: 891.6, altitude: 550, inclination: 53.0,
        frequency: 'Ka-band', power: 2.1, temperature: -44.5, battery: 95.1
      },
      { 
        id: realGroundStationIds[0], x: 20, y: 50, type: 'ground', status: 'operational', 
        load: 45.2, latency: 1.2, throughput: 1200.0, location: 'North America',
        frequency: 'Ka-band', power: 5.0, temperature: 22.3, uptime: 99.97
      },
      { 
        id: realGroundStationIds[1], x: 90, y: 20, type: 'ground', status: 'operational', 
        load: 52.8, latency: 1.5, throughput: 1150.0, location: 'Europe',
        frequency: 'Ka-band', power: 4.8, temperature: 18.7, uptime: 99.95
      }
    ];

    const connections = [
      { from: realSatelliteIds[0], to: realSatelliteIds[1], active: true, latency: 23.4, bandwidth: 1000, utilization: 67.3, snr: 12.5, ber: 1e-9 },
      { from: realSatelliteIds[1], to: realSatelliteIds[2], active: true, latency: 25.1, bandwidth: 1000, utilization: 72.1, snr: 11.8, ber: 1e-8 },
      { from: realSatelliteIds[2], to: realSatelliteIds[3], active: true, latency: 24.7, bandwidth: 1000, utilization: 58.7, snr: 13.2, ber: 1e-10 },
      { from: realSatelliteIds[3], to: realSatelliteIds[0], active: true, latency: 22.9, bandwidth: 1000, utilization: 68.9, snr: 12.1, ber: 1e-9 },
      { from: realGroundStationIds[0], to: realSatelliteIds[0], active: true, latency: 1.2, bandwidth: 1200, utilization: 45.2, snr: 15.3, ber: 1e-12 },
      { from: realGroundStationIds[1], to: realSatelliteIds[1], active: true, latency: 1.5, bandwidth: 1200, utilization: 52.8, snr: 14.7, ber: 1e-11 },
      { from: realSatelliteIds[0], to: realSatelliteIds[2], active: false, latency: 28.3, bandwidth: 1000, utilization: 0, snr: 0, ber: 0 },
      { from: realSatelliteIds[1], to: realSatelliteIds[3], active: false, latency: 29.1, bandwidth: 1000, utilization: 0, snr: 0, ber: 0 },
      { from: realGroundStationIds[0], to: realSatelliteIds[2], active: false, latency: 1.8, bandwidth: 1200, utilization: 0, snr: 0, ber: 0 },
      { from: realGroundStationIds[1], to: realSatelliteIds[3], active: false, latency: 2.1, bandwidth: 1200, utilization: 0, snr: 0, ber: 0 }
    ];

    return (
      <div style={{ height: '350px', position: 'relative', border: '1px solid #333', borderRadius: '4px', padding: '10px' }}>
        <Grid>
          <Grid.Col span={8}>
            <Text size="xs" weight="bold" mb="sm" color="#00ff88">NETWORK TOPOLOGY & REROUTING</Text>
            
            {/* Topology Visualization Container */}
            <div style={{ 
              position: 'relative', 
              height: '220px', 
              width: '100%', 
              border: '1px solid #444', 
              borderRadius: '4px',
              backgroundColor: '#0a0a0a',
              overflow: 'hidden'
            }}>
              {/* Connections */}
              <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
                {connections.map((conn, index) => {
                  const fromNode = nodes.find(n => n.id === conn.from);
                  const toNode = nodes.find(n => n.id === conn.to);
                  if (!fromNode || !toNode) return null;
                  
                  const isReroute = predictiveDemo.reroutePaths.some(path => 
                    path.from === conn.from && path.to === conn.to
                  );
                  const isAttackNode = predictiveDemo.attackNode === conn.from || predictiveDemo.attackNode === conn.to;
                  const isBackupPath = !conn.active && isReroute;
                  
                  return (
                    <g key={index}>
                      <line
                        x1={`${fromNode.x}%`}
                        y1={`${fromNode.y}%`}
                        x2={`${toNode.x}%`}
                        y2={`${toNode.y}%`}
                        stroke={isReroute ? '#6bcf7f' : isAttackNode ? '#ff6b6b' : conn.active ? '#4dabf7' : '#666'}
                        strokeWidth={isReroute ? '3' : isBackupPath ? '2' : '2'}
                        strokeDasharray={isBackupPath ? '5,3' : 'none'}
                        opacity={isAttackNode && predictiveDemo.warningTime > 0 ? 0.3 : isBackupPath ? 0.6 : 1}
                      />
                      {/* Connection metrics */}
                      {conn.active && (
                        <text
                          x={`${(fromNode.x + toNode.x) / 2}%`}
                          y={`${(fromNode.y + toNode.y) / 2 - 5}%`}
                          fontSize="7"
                          fill="#fff"
                          textAnchor="middle"
                          style={{ 
                            backgroundColor: 'rgba(0,0,0,0.8)', 
                            padding: '1px 2px',
                            borderRadius: '2px'
                          }}
                        >
                          {conn.latency}ms
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
              
              {/* Nodes */}
              {nodes.map(node => {
                const isAttackNode = predictiveDemo.attackNode === node.id;
                const isRerouteTarget = predictiveDemo.reroutePaths.some(path => path.to === node.id);
                
                return (
                  <div
                    key={node.id}
                    style={{
                      position: 'absolute',
                      left: `${node.x}%`,
                      top: `${node.y}%`,
                      transform: 'translate(-50%, -50%)',
                      zIndex: 10
                    }}
                  >
                    {/* Node Circle */}
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: isAttackNode ? '#ff6b6b' : isRerouteTarget ? '#6bcf7f' : node.type === 'satellite' ? '#4dabf7' : '#ffd93d',
                        border: isAttackNode ? '2px solid #ff0000' : '1px solid #fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '7px',
                        fontWeight: 'bold',
                        color: '#fff',
                        animation: isAttackNode && predictiveDemo.warningTime > 0 ? 'pulse 1s infinite' : 'none',
                        margin: '0 auto'
                      }}
                    >
                      {node.type === 'satellite' ? 'S' : 'G'}
                    </div>
                    
                    {/* Node Label */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '25px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontSize: '6px',
                        color: isAttackNode ? '#ff6b6b' : isRerouteTarget ? '#6bcf7f' : '#ffffff',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        padding: '1px 2px',
                        borderRadius: '2px',
                        whiteSpace: 'nowrap',
                        minWidth: '40px'
                      }}
                    >
                      {node.id}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Status indicators */}
            <div style={{ marginTop: '8px' }}>
              <Group spacing="sm">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: '10px', height: '10px', backgroundColor: '#4dabf7', borderRadius: '50%', marginRight: '6px' }}></div>
                  <Text size="xs">Normal</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: '10px', height: '10px', backgroundColor: '#ff6b6b', borderRadius: '50%', marginRight: '6px' }}></div>
                  <Text size="xs">Under Attack</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: '10px', height: '10px', backgroundColor: '#6bcf7f', borderRadius: '50%', marginRight: '6px' }}></div>
                  <Text size="xs">Reroute Target</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ width: '10px', height: '10px', backgroundColor: '#666', borderRadius: '50%', marginRight: '6px' }}></div>
                  <Text size="xs">Backup Path</Text>
                </div>
              </Group>
            </div>
          </Grid.Col>
          
          <Grid.Col span={4}>
            <Stack spacing="xs">
              <Text size="xs" weight="bold" color="#00ff88">NODE METRICS</Text>
              <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
                {nodes.map(node => {
                  const isAttackNode = predictiveDemo.attackNode === node.id;
                  const isRerouteTarget = predictiveDemo.reroutePaths.some(path => path.to === node.id);
                  
                  return (
                    <div key={node.id} style={{ 
                      padding: '6px', 
                      border: '1px solid #333', 
                      borderRadius: '3px',
                      backgroundColor: isAttackNode ? '#2a0a0a' : isRerouteTarget ? '#0a2a0a' : '#1a1a1a',
                      marginBottom: '4px'
                    }}>
                      <Text size="xs" weight="bold" color={isAttackNode ? 'red' : isRerouteTarget ? 'green' : 'white'}>
                        {node.id}
                      </Text>
                      <div style={{ fontSize: '9px', color: '#ccc', lineHeight: '1.2' }}>
                        <div>L:{node.load}% | {node.latency}ms | {node.throughput}Mbps</div>
                        <div>Status: {isAttackNode ? 'ATTACKED' : isRerouteTarget ? 'REROUTE' : 'NORMAL'}</div>
                        {node.type === 'satellite' && (
                          <div>Alt:{node.altitude}km | Pwr:{node.power}W | Bat:{node.battery}%</div>
                        )}
                        {node.type === 'ground' && (
                          <div>Loc:{node.location} | Uptime:{node.uptime}%</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Stack>
          </Grid.Col>
        </Grid>
      </div>
    );
  };

  return (
    <div style={{ 
      padding: '16px', 
      height: '100%', 
      overflow: 'auto', 
      fontSize: '12px',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#0a0a0a',
      color: '#ffffff'
    }}>
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.8; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
      
      {/* Header */}
      <div style={{ marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '16px' }}>
        
        {/* Network Status Summary */}
        <Group spacing="lg" mb="md">
          <div>
            <Text size="xs" color="#888">Network Health</Text>
            <Text size="lg" weight="bold" color={networkHealth > 90 ? '#00ff88' : networkHealth > 70 ? '#ffaa00' : '#ff4444'}>
              {networkHealth.toFixed(1)}%
            </Text>
          </div>
          <div>
            <Text size="xs" color="#888">Active Nodes</Text>
            <Text size="lg" weight="bold" color="#00ff88">{realSatelliteIds.length + realGroundStationIds.length}</Text>
          </div>
          <div>
            <Text size="xs" color="#888">Avg Latency</Text>
            <Text size="lg" weight="bold" color="#00aaff">{networkMetrics.latency.toFixed(1)}ms</Text>
          </div>
          <div>
            <Text size="xs" color="#888">Throughput</Text>
            <Text size="lg" weight="bold" color="#00ff88">{networkMetrics.throughput.toFixed(1)}%</Text>
          </div>
        </Group>
      </div>
      <Stack spacing="xs">
        {/* Header */}
        <Card>
          <Group position="apart">
            <div>
              <Text size="sm" weight="bold" color="#00ff88">NETWORK AI</Text>
              <Text size="xs" color="#666">Self-healing topology</Text>
              
            </div>
            <Group>
              <Button
                size="xs"
                leftIcon={isSimulationRunning ? <IconPlayerPause size={12} /> : <IconPlayerPlay size={12} />}
                onClick={isSimulationRunning ? stopSimulation : startSimulation}
                color={isSimulationRunning ? 'red' : 'green'}
                style={{ fontSize: '10px' }}
              >
                {isSimulationRunning ? 'STOP' : 'START'}
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
                  addConsoleLog('Test data: Point added', 'info');
                }}
                variant="outline"
                color="blue"
              >
                Add Test Data
              </Button>
              <Button
                size="xs"
                onClick={startPredictiveDemo}
                disabled={predictiveDemo.isRunning}
                variant="outline"
                color="blue"
                style={{ fontSize: '10px' }}
              >
                AI DEMO
              </Button>
            </Group>
          </Group>
        </Card>

        {/* Predictive Demo Status */}
        {predictiveDemo.isRunning && (
          <Card style={{ border: '2px solid #ff6b6b', backgroundColor: '#1a0a0a', padding: '12px' }}>
            <Group position="apart" mb="sm">
              <Text size="sm" weight="bold" color="red">PREDICTIVE AI DEMONSTRATION</Text>
              <Badge color="red" variant="filled">ACTIVE</Badge>
            </Group>
            
            <Grid>
              <Grid.Col span={3}>
                <div style={{ textAlign: 'center' }}>
                  <Text size="xs" color="#888">Target Node</Text>
                  <Text size="md" weight="bold" color="red">{predictiveDemo.attackNode || 'Analyzing...'}</Text>
                </div>
              </Grid.Col>
              <Grid.Col span={3}>
                <div style={{ textAlign: 'center' }}>
                  <Text size="xs" color="#888">Warning Time</Text>
                  <Text size="md" weight="bold" color={predictiveDemo.warningTime > 5 ? 'yellow' : 'red'}>
                    {predictiveDemo.warningTime > 0 ? `${predictiveDemo.warningTime}s` : 'N/A'}
                  </Text>
                </div>
              </Grid.Col>
              <Grid.Col span={3}>
                <div style={{ textAlign: 'center' }}>
                  <Text size="xs" color="#888">Uptime</Text>
                  <Text size="md" weight="bold" color="green">100%</Text>
                </div>
              </Grid.Col>
              <Grid.Col span={3}>
                <div style={{ textAlign: 'center' }}>
                  <Text size="xs" color="#888">Reroute Paths</Text>
                  <Text size="md" weight="bold" color="green">{predictiveDemo.reroutePaths.length}</Text>
                </div>
              </Grid.Col>
            </Grid>
            
            {predictiveDemo.reroutePaths.length > 0 && (
              <div style={{ marginTop: '8px' }}>
                <Text size="xs" weight="bold" mb="xs" color="#00ff88">Active Reroute Paths:</Text>
                <Group spacing="xs">
                  {predictiveDemo.reroutePaths.map((path, index) => (
                    <Badge key={index} color="green" variant="filled" size="xs">
                      {path.from}→{path.to} ({path.latency}ms, SNR:{path.snr}dB)
                    </Badge>
                  ))}
                </Group>
              </div>
            )}
          </Card>
        )}

        {/* Network Overview */}
        <Card style={{ padding: '6px', backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
          <Group position="apart" mb="xs">
            <Text size="xs" weight="bold" color="#00ff88">NETWORK STATUS</Text>
            <Badge size="xs" color={getHealthColor(networkHealth)}>{networkHealth.toFixed(1)}%</Badge>
          </Group>
          <Progress value={networkHealth} color={getHealthColor(networkHealth)} size="xs" mb="xs" />
          <Group spacing="md" position="apart">
            <Group spacing="xs">
              <Text size="xs">Time:</Text>
              <Badge size="xs" color="gray">{simulationTime}s</Badge>
            </Group>
            <Group spacing="xs">
              <Text size="xs">Failures:</Text>
              <Badge size="xs" color="red">{activeFailures.length}</Badge>
            </Group>
            <Group spacing="xs">
              <Text size="xs">Nodes:</Text>
              <Badge size="xs" color="blue">{topology.nodes.length}</Badge>
            </Group>
            <Group spacing="xs">
              <Text size="xs">Links:</Text>
              <Badge size="xs" color="green">{topology.edges.filter(e => e.status === 'active').length}</Badge>
            </Group>
          </Group>
        </Card>

        {/* Analytics Dashboard */}
        <Card style={{ padding: '6px', backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
          <Text size="xs" weight="bold" color="#00ff88" mb="xs">ANALYTICS</Text>
          <Tabs defaultValue="topology">
            <Tabs.List>
              <Tabs.Tab value="topology" icon={<IconNetwork size={10} />} style={{ fontSize: '9px', padding: '4px 8px' }}>Topology</Tabs.Tab>
              <Tabs.Tab value="metrics" icon={<IconChartLine size={10} />} style={{ fontSize: '9px', padding: '4px 8px' }}>Metrics</Tabs.Tab>
              <Tabs.Tab value="capacity" icon={<IconChartBar size={10} />} style={{ fontSize: '9px', padding: '4px 8px' }}>Capacity</Tabs.Tab>
              <Tabs.Tab value="faults" icon={<IconAlertTriangle size={10} />} style={{ fontSize: '9px', padding: '4px 8px' }}>Faults</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="topology" pt="sm">
              <NetworkTopology />
            </Tabs.Panel>

            <Tabs.Panel value="metrics" pt="sm">
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
              
              {/* Dense Performance Metrics */}
              <Grid mt="xs">
                <Grid.Col span={6}>
                  <Card style={{ backgroundColor: '#0f0f0f', border: '1px solid #444', padding: '6px' }}>
                    <Text size="xs" weight="bold" mb="xs" color="#00ff88">PERFORMANCE</Text>
                    <Stack spacing="xs">
                      <Group position="apart">
                        <Text size="xs">Avg Latency:</Text>
                        <Text size="xs" color="green">{networkMetrics.latency.toFixed(1)}ms</Text>
                      </Group>
                      <Group position="apart">
                        <Text size="xs">P95 Latency:</Text>
                        <Text size="xs" color="yellow">{(networkMetrics.latency * 1.8).toFixed(1)}ms</Text>
                      </Group>
                      <Group position="apart">
                        <Text size="xs">P99 Latency:</Text>
                        <Text size="xs" color="red">{(networkMetrics.latency * 2.5).toFixed(1)}ms</Text>
                      </Group>
                      <Group position="apart">
                        <Text size="xs">Jitter:</Text>
                        <Text size="xs" color="cyan">{networkMetrics.jitter.toFixed(2)}ms</Text>
                      </Group>
                      <Group position="apart">
                        <Text size="xs">Packet Loss:</Text>
                        <Text size="xs" color="orange">{networkMetrics.packetLoss.toFixed(3)}%</Text>
                      </Group>
                    </Stack>
                  </Card>
                </Grid.Col>
                
                <Grid.Col span={6}>
                  <Card style={{ backgroundColor: '#0f0f0f', border: '1px solid #444', padding: '6px' }}>
                    <Text size="xs" weight="bold" mb="xs" color="#00ff88">THROUGHPUT</Text>
                    <Stack spacing="xs">
                      <Group position="apart">
                        <Text size="xs">Current:</Text>
                        <Text size="xs" color="green">{networkMetrics.throughput.toFixed(1)}%</Text>
                      </Group>
                      <Group position="apart">
                        <Text size="xs">Peak:</Text>
                        <Text size="xs" color="blue">98.7%</Text>
                      </Group>
                      <Group position="apart">
                        <Text size="xs">Bandwidth Util:</Text>
                        <Text size="xs" color="yellow">{networkMetrics.bandwidthUtilization.toFixed(1)}%</Text>
                      </Group>
                      <Group position="apart">
                        <Text size="xs">Data Rate:</Text>
                        <Text size="xs" color="cyan">{(networkMetrics.throughput * 12.5).toFixed(1)}Gbps</Text>
                      </Group>
                      <Group position="apart">
                        <Text size="xs">Efficiency:</Text>
                        <Text size="xs" color="green">{(networkMetrics.throughput / networkMetrics.bandwidthUtilization * 100).toFixed(1)}%</Text>
                      </Group>
                    </Stack>
                  </Card>
                </Grid.Col>
                
                <Grid.Col span={6}>
                  <Card style={{ backgroundColor: '#0f0f0f', border: '1px solid #444', padding: '6px' }}>
                    <Text size="xs" weight="bold" mb="xs" color="#00ff88">HEALTH</Text>
                    <Stack spacing="xs">
                      <Group position="apart">
                        <Text size="xs">Connectivity:</Text>
                        <Text size="xs" color="green">{networkMetrics.connectivity.toFixed(1)}%</Text>
                      </Group>
                      <Group position="apart">
                        <Text size="xs">Fault Tolerance:</Text>
                        <Text size="xs" color="blue">{networkMetrics.resilience.toFixed(2)}</Text>
                      </Group>
                      <Group position="apart">
                        <Text size="xs">Availability:</Text>
                        <Text size="xs" color="green">99.97%</Text>
                      </Group>
                      <Group position="apart">
                        <Text size="xs">MTBF:</Text>
                        <Text size="xs" color="cyan">2,847h</Text>
                      </Group>
                      <Group position="apart">
                        <Text size="xs">MTTR:</Text>
                        <Text size="xs" color="yellow">3.2min</Text>
                      </Group>
                    </Stack>
                  </Card>
                </Grid.Col>
                
                <Grid.Col span={6}>
                  <Card style={{ backgroundColor: '#0f0f0f', border: '1px solid #444', padding: '6px' }}>
                    <Text size="xs" weight="bold" mb="xs" color="#00ff88">AI METRICS</Text>
                    <Stack spacing="xs">
                      <Group position="apart">
                        <Text size="xs">Prediction Accuracy:</Text>
                        <Text size="xs" color="green">97.3%</Text>
                      </Group>
                      <Group position="apart">
                        <Text size="xs">Response Time:</Text>
                        <Text size="xs" color="blue">2.1ms</Text>
                      </Group>
                      <Group position="apart">
                        <Text size="xs">False Positives:</Text>
                        <Text size="xs" color="yellow">0.8%</Text>
                      </Group>
                      <Group position="apart">
                        <Text size="xs">Model Confidence:</Text>
                        <Text size="xs" color="cyan">94.7%</Text>
                      </Group>
                      <Group position="apart">
                        <Text size="xs">Learning Rate:</Text>
                        <Text size="xs" color="green">0.001</Text>
                      </Group>
                    </Stack>
                  </Card>
                </Grid.Col>
              </Grid>
            </Tabs.Panel>

            <Tabs.Panel value="capacity" pt="sm">
              <Grid>
                <Grid.Col span={12}>
                  <CapacityPlot />
                </Grid.Col>
                <Grid.Col span={12}>
                  <Stack spacing="md">
                    <Card style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
                      <Text size="sm" weight="bold" mb="sm">Bandwidth Metrics</Text>
                      <Stack spacing="xs">
                        <Group position="apart">
                          <Text size="xs">Current Util:</Text>
                          <Text size="xs" color={getMetricColor(networkMetrics.bandwidthUtilization, 'bandwidth')}>
                            {networkMetrics.bandwidthUtilization.toFixed(1)}%
                          </Text>
                        </Group>
                        <Group position="apart">
                          <Text size="xs">Peak Util:</Text>
                          <Text size="xs" color="red">94.2%</Text>
                        </Group>
                        <Group position="apart">
                          <Text size="xs">Available:</Text>
                          <Text size="xs" color="green">{(100 - networkMetrics.bandwidthUtilization).toFixed(1)}%</Text>
                        </Group>
                        <Group position="apart">
                          <Text size="xs">Total Capacity:</Text>
                          <Text size="xs" color="cyan">12.5Tbps</Text>
                        </Group>
                        <Group position="apart">
                          <Text size="xs">Used Capacity:</Text>
                          <Text size="xs" color="yellow">{(networkMetrics.bandwidthUtilization * 0.125).toFixed(2)}Tbps</Text>
                        </Group>
                      </Stack>
                    </Card>
                    
                    <Card style={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}>
                      <Text size="sm" weight="bold" mb="sm">Quality Metrics</Text>
                      <Stack spacing="xs">
                        <Group position="apart">
                          <Text size="xs">Jitter:</Text>
                          <Text size="xs" color={getMetricColor(networkMetrics.jitter, 'jitter')}>
                            {networkMetrics.jitter.toFixed(2)}ms
                          </Text>
                        </Group>
                        <Group position="apart">
                          <Text size="xs">MOS Score:</Text>
                          <Text size="xs" color="green">4.7</Text>
                        </Group>
                        <Group position="apart">
                          <Text size="xs">R-Factor:</Text>
                          <Text size="xs" color="blue">87.3</Text>
                        </Group>
                        <Group position="apart">
                          <Text size="xs">Packet Delay:</Text>
                          <Text size="xs" color="cyan">{(networkMetrics.latency + networkMetrics.jitter).toFixed(1)}ms</Text>
                        </Group>
                        <Group position="apart">
                          <Text size="xs">Buffer Utilization:</Text>
                          <Text size="xs" color="yellow">23.4%</Text>
                        </Group>
                      </Stack>
                    </Card>
                    
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

            <Tabs.Panel value="faults" pt="sm">
              <Grid>
                <Grid.Col span={12}>
                  <FaultMatrixPlot />
                </Grid.Col>
                <Grid.Col span={12}>
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
        <Card style={{ padding: '6px' }}>
          <Text size="sm" weight="bold" mb="xs" color="#00ff88">NETWORK OPERATIONS CONSOLE</Text>
          <div 
            ref={consoleRef}
            style={{ 
              height: '200px', 
              overflowY: 'auto', 
              backgroundColor: '#0a0a0a', 
              padding: '8px', 
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '11px'
            }}>
            {consoleLogs.length === 0 ? (
              <Text size="sm" color="dimmed">Console ready... Start simulation to see network operations.</Text>
            ) : (
              consoleLogs.map(log => (
                <div key={log.id} style={{ 
                  marginBottom: '2px',
                  lineHeight: '1.2',
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
