import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import { Layout as DashboardLayout } from "../../layouts/index.js";

// Mock data voor virtuele machines
const mockVMs = [
  {
    id: 1,
    name: "VM-Prod-01",
    status: "Running",
    resourceGroup: "Production",
    location: "West Europe",
    size: "Standard_D2s_v3",
    osType: "Windows",
    ipAddress: "10.0.0.1",
  },
  {
    id: 2,
    name: "VM-Dev-01",
    status: "Stopped",
    resourceGroup: "Development",
    location: "West Europe",
    size: "Standard_B2s",
    osType: "Linux",
    ipAddress: "10.0.0.2",
  },
  {
    id: 3,
    name: "VM-Test-01",
    status: "Running",
    resourceGroup: "Testing",
    location: "West Europe",
    size: "Standard_D1s_v3",
    osType: "Windows",
    ipAddress: "10.0.0.3",
  },
];

const Page = () => {
  const router = useRouter();
  const [vms, setVMs] = useState(mockVMs);
  const [filteredVMs, setFilteredVMs] = useState(mockVMs);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const { status } = router.query;
    if (status) {
      setStatusFilter(status);
    }
  }, [router.query]);

  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredVMs(vms);
    } else {
      setFilteredVMs(vms.filter(vm => vm.status === statusFilter));
    }
  }, [statusFilter, vms]);

  const handleStart = (id) => {
    setVMs(vms.map(vm => 
      vm.id === id ? { ...vm, status: "Running" } : vm
    ));
  };

  const handleStop = (id) => {
    setVMs(vms.map(vm => 
      vm.id === id ? { ...vm, status: "Stopped" } : vm
    ));
  };

  const handleRestart = (id) => {
    setVMs(vms.map(vm => 
      vm.id === id ? { ...vm, status: "Restarting" } : vm
    ));
    // Simuleer een korte vertraging voor het herstarten
    setTimeout(() => {
      setVMs(vms.map(vm => 
        vm.id === id ? { ...vm, status: "Running" } : vm
      ));
    }, 2000);
  };

  const handleDelete = (id) => {
    setVMs(vms.filter(vm => vm.id !== id));
  };

  const handleStatusFilterChange = (event) => {
    const newStatus = event.target.value;
    setStatusFilter(newStatus);
    if (newStatus === "all") {
      router.push("/azure/virtual-machines");
    } else {
      router.push(`/azure/virtual-machines?status=${newStatus}`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Running":
        return "success";
      case "Stopped":
        return "error";
      case "Restarting":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <DashboardLayout>
      <Box
        sx={{
          flexGrow: 1,
          py: 4,
        }}
      >
        <Container maxWidth={false}>
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h4">Azure Virtual Machines</Typography>
              <Button variant="contained" color="primary">
                Create VM
              </Button>
            </Stack>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                  <FormControl sx={{ minWidth: 250 }}>
                    <InputLabel>Status Filter</InputLabel>
                    <Select
                      value={statusFilter}
                      label="Status Filter"
                      onChange={handleStatusFilterChange}
                      sx={{
                        '& .MuiSelect-select': {
                          py: 1.5,
                          fontSize: '0.875rem',
                        },
                      }}
                    >
                      <MenuItem value="all">All VMs</MenuItem>
                      <MenuItem value="Running">Running</MenuItem>
                      <MenuItem value="Stopped">Stopped</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Resource Group</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Size</TableCell>
                        <TableCell>OS Type</TableCell>
                        <TableCell>IP Address</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredVMs.map((vm) => (
                        <TableRow key={vm.id}>
                          <TableCell>{vm.name}</TableCell>
                          <TableCell>
                            <Chip 
                              label={vm.status} 
                              color={getStatusColor(vm.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{vm.resourceGroup}</TableCell>
                          <TableCell>{vm.location}</TableCell>
                          <TableCell>{vm.size}</TableCell>
                          <TableCell>{vm.osType}</TableCell>
                          <TableCell>{vm.ipAddress}</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              {vm.status !== "Running" && (
                                <IconButton 
                                  size="small" 
                                  color="success"
                                  onClick={() => handleStart(vm.id)}
                                >
                                  <PlayArrowIcon />
                                </IconButton>
                              )}
                              {vm.status === "Running" && (
                                <IconButton 
                                  size="small" 
                                  color="error"
                                  onClick={() => handleStop(vm.id)}
                                >
                                  <StopIcon />
                                </IconButton>
                              )}
                              <IconButton 
                                size="small" 
                                color="warning"
                                onClick={() => handleRestart(vm.id)}
                              >
                                <RestartAltIcon />
                              </IconButton>
                              <IconButton 
                                size="small" 
                                color="error"
                                onClick={() => handleDelete(vm.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Stack>
        </Container>
      </Box>
    </DashboardLayout>
  );
};

export default Page; 