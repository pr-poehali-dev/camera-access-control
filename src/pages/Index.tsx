import { useState } from "react";
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Icon from "@/components/ui/icon";

type UserRole = "admin" | "user" | "operator";

interface User {
  id: number;
  name: string;
  role: UserRole;
  active: boolean;
}

interface Camera {
  id: number;
  name: string;
  ip: string;
  port: number;
  username: string;
  password: string;
  protocol: "ONVIF" | "RTSP";
  status: "online" | "offline" | "error";
  location: string;
}

interface PendingEvent {
  id: number;
  plate: string;
  timestamp: string;
  camera: string;
  confidence: number;
  status: "pending" | "confirmed" | "rejected";
  image?: string;
}

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState<User>({
    id: 1,
    name: "Администратор",
    role: "admin",
    active: true,
  });
  const [showAddCamera, setShowAddCamera] = useState(false);
  const [showAddPlate, setShowAddPlate] = useState(false);
  const [editingPlate, setEditingPlate] = useState<any>(null);
  const [newCamera, setNewCamera] = useState<Partial<Camera>>({
    name: "",
    ip: "",
    port: 554,
    username: "",
    password: "",
    protocol: "ONVIF",
    location: "",
  });
  const [newPlate, setNewPlate] = useState({
    plate: "",
    owner: "",
    expires: "",
  });
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [database, setDatabase] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [pendingEvents, setPendingEvents] = useState<PendingEvent[]>([]);
  const [isTestingCamera, setIsTestingCamera] = useState<number | null>(null);
  const [eventFilter, setEventFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString("ru-RU"),
  );
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);

  // Обновляем время каждую секунду
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString("ru-RU"));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Моковые данные для демонстрации
  // Инициализация данных
  React.useEffect(() => {
    const mockEvents = [
      {
        id: 1,
        plate: "А123БВ199",
        time: "14:32",
        status: "allowed",
        camera: "Камера 1",
      },
      {
        id: 2,
        plate: "М456ЕК777",
        time: "14:28",
        status: "denied",
        camera: "Камера 2",
      },
      {
        id: 3,
        plate: "О789НР178",
        time: "14:25",
        status: "allowed",
        camera: "Камера 1",
      },
      {
        id: 4,
        plate: "Р012СТ199",
        time: "14:20",
        status: "unknown",
        camera: "Камера 3",
      },
    ];

    const mockDatabase = [
      {
        id: 1,
        plate: "А123БВ199",
        owner: "Иванов И.И.",
        status: "active",
        expires: "2024-12-31",
      },
      {
        id: 2,
        plate: "О789НР178",
        owner: "Петров П.П.",
        status: "active",
        expires: "2024-11-15",
      },
      {
        id: 3,
        plate: "С456УФ123",
        owner: "Сидоров С.С.",
        status: "expired",
        expires: "2024-06-30",
      },
    ];

    setEvents(mockEvents);
    setDatabase(mockDatabase);
    setCameras(mockCameras);
    setPendingEvents(mockPendingEvents);
  }, []);

  const mockCameras: Camera[] = [
    {
      id: 1,
      name: "Камера 1 - Вход",
      ip: "192.168.1.101",
      port: 554,
      username: "admin",
      password: "password123",
      protocol: "ONVIF",
      status: "online",
      location: "Главный вход",
    },
    {
      id: 2,
      name: "Камера 2 - Выход",
      ip: "192.168.1.102",
      port: 554,
      username: "admin",
      password: "password123",
      protocol: "ONVIF",
      status: "online",
      location: "Главный выход",
    },
    {
      id: 3,
      name: "Камера 3 - Парковка",
      ip: "192.168.1.103",
      port: 554,
      username: "admin",
      password: "password123",
      protocol: "ONVIF",
      status: "error",
      location: "Парковка",
    },
  ];

  const mockPendingEvents: PendingEvent[] = [
    {
      id: 1,
      plate: "К789МН199",
      timestamp: "2024-07-09 15:32:45",
      camera: "Камера 1",
      confidence: 95,
      status: "pending",
    },
    {
      id: 2,
      plate: "Т456УЦ777",
      timestamp: "2024-07-09 15:28:12",
      camera: "Камера 2",
      confidence: 87,
      status: "pending",
    },
  ];

  const mockStats = {
    totalPassed: 1247,
    todayPassed: 89,
    denied: 12,
    activeCameras: 8,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "allowed":
        return "bg-green-100 text-green-800";
      case "denied":
        return "bg-red-100 text-red-800";
      case "unknown":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "allowed":
        return "Разрешён";
      case "denied":
        return "Запрещён";
      case "unknown":
        return "Неизвестен";
      default:
        return status;
    }
  };

  const getRoleText = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "Администратор";
      case "user":
        return "Пользователь";
      case "operator":
        return "Оператор КПП";
      default:
        return role;
    }
  };

  const getCameraStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-100 text-green-800";
      case "offline":
        return "bg-gray-100 text-gray-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleAddCamera = () => {
    if (
      newCamera.name &&
      newCamera.ip &&
      newCamera.port &&
      newCamera.username &&
      newCamera.password
    ) {
      const camera: Camera = {
        id: Date.now(),
        name: newCamera.name,
        ip: newCamera.ip,
        port: newCamera.port || 554,
        username: newCamera.username,
        password: newCamera.password,
        protocol: newCamera.protocol || "ONVIF",
        status: "offline",
        location: newCamera.location || "",
      };
      setCameras([...cameras, camera]);
      setShowAddCamera(false);
      setNewCamera({
        name: "",
        ip: "",
        port: 554,
        username: "",
        password: "",
        protocol: "ONVIF",
        location: "",
      });
    }
  };

  const handleConfirmEvent = (eventId: number, confirmed: boolean) => {
    setPendingEvents(pendingEvents.filter((e) => e.id !== eventId));

    const event = pendingEvents.find((e) => e.id === eventId);
    if (event) {
      const newEvent = {
        id: Date.now(),
        plate: event.plate,
        time: new Date().toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: confirmed ? "allowed" : "denied",
        camera: event.camera,
        timestamp: new Date().toISOString(),
      };
      setEvents([newEvent, ...events]);
    }
  };

  const handleDeleteCamera = (cameraId: number) => {
    setCameras(cameras.filter((cam) => cam.id !== cameraId));
  };

  const handleTestCamera = async (cameraId: number) => {
    setIsTestingCamera(cameraId);
    setTimeout(() => {
      setCameras(
        cameras.map((cam) =>
          cam.id === cameraId
            ? { ...cam, status: Math.random() > 0.3 ? "online" : "error" }
            : cam,
        ),
      );
      setIsTestingCamera(null);
    }, 2000);
  };

  const handleAddPlate = () => {
    if (newPlate.plate && newPlate.owner && newPlate.expires) {
      const plate = {
        id: Date.now(),
        plate: newPlate.plate,
        owner: newPlate.owner,
        status: "active",
        expires: newPlate.expires,
      };
      setDatabase([...database, plate]);
      setShowAddPlate(false);
      setNewPlate({ plate: "", owner: "", expires: "" });
    }
  };

  const handleEditPlate = (plate: any) => {
    setEditingPlate(plate);
    setNewPlate({
      plate: plate.plate,
      owner: plate.owner,
      expires: plate.expires,
    });
    setShowAddPlate(true);
  };

  const handleUpdatePlate = () => {
    if (editingPlate && newPlate.plate && newPlate.owner && newPlate.expires) {
      setDatabase(
        database.map((p) =>
          p.id === editingPlate.id
            ? {
                ...p,
                plate: newPlate.plate,
                owner: newPlate.owner,
                expires: newPlate.expires,
              }
            : p,
        ),
      );
      setShowAddPlate(false);
      setEditingPlate(null);
      setNewPlate({ plate: "", owner: "", expires: "" });
    }
  };

  const handleDeletePlate = (plateId: number) => {
    setDatabase(database.filter((p) => p.id !== plateId));
  };

  const canAccess = (requiredRole: UserRole) => {
    const roleHierarchy = { admin: 3, operator: 2, user: 1 };
    return roleHierarchy[currentUser.role] >= roleHierarchy[requiredRole];
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.camera.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = eventFilter === "all" || event.status === eventFilter;
    const matchesDate = !dateFilter || event.timestamp?.startsWith(dateFilter);
    return matchesSearch && matchesFilter && matchesDate;
  });

  const filteredDatabase = database.filter(
    (record) =>
      record.plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.owner.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredCameras = cameras.filter(
    (camera) =>
      camera.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      camera.ip.includes(searchQuery) ||
      camera.location.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Система контроля доступа
            </h1>
            <p className="text-gray-600">
              Мониторинг автотранспорта по государственным номерам
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Текущий пользователь:</p>
              <p className="font-medium">{currentUser.name}</p>
              <Badge variant="outline">{getRoleText(currentUser.role)}</Badge>
            </div>
            <Select
              value={currentUser.role}
              onValueChange={(value) =>
                setCurrentUser({ ...currentUser, role: value as UserRole })
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Администратор</SelectItem>
                <SelectItem value="operator">Оператор КПП</SelectItem>
                <SelectItem value="user">Пользователь</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105 animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Всего проездов
              </CardTitle>
              <Icon name="Car" className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {mockStats.totalPassed}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105 animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Сегодня
              </CardTitle>
              <Icon name="Clock" className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {mockStats.todayPassed}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105 animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Отказано
              </CardTitle>
              <Icon
                name="Shield"
                className="h-4 w-4 text-gray-400 animate-pulse-security"
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {mockStats.denied}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105 animate-fade-in">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Активных камер
              </CardTitle>
              <Icon name="Camera" className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {mockStats.activeCameras}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Основной контент */}
        <Tabs defaultValue="monitoring" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="monitoring">Мониторинг</TabsTrigger>
            <TabsTrigger value="database">База номеров</TabsTrigger>
            <TabsTrigger value="events">События</TabsTrigger>
            {canAccess("operator") && (
              <TabsTrigger value="operator">Оператор КПП</TabsTrigger>
            )}
            {canAccess("admin") && (
              <TabsTrigger value="cameras">IP Камеры</TabsTrigger>
            )}
            <TabsTrigger value="settings">Настройки</TabsTrigger>
          </TabsList>

          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Видеонаблюдение */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Camera" className="h-5 w-5" />
                    Видеонаблюдение
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {cameras.slice(0, 4).map((camera, index) => (
                      <div
                        key={camera.id}
                        className="relative bg-gray-800 rounded-lg aspect-video overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setSelectedCamera(camera)}
                      >
                        {camera.status === "online" ? (
                          <div className="relative w-full h-full">
                            <img
                              src={
                                index === 0
                                  ? "/img/94c64a41-1ac2-46df-9b32-cf6aaa7474f8.jpg"
                                  : `https://picsum.photos/640/360?random=${camera.id}`
                              }
                              alt={camera.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                              {camera.name}
                            </div>
                            <div className="absolute top-2 right-2 flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                              <span className="text-white text-xs">LIVE</span>
                            </div>
                            <div className="absolute bottom-2 left-2 text-white text-xs bg-black bg-opacity-70 px-2 py-1 rounded">
                              {currentTime}
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-white">
                            <Icon
                              name="CameraOff"
                              className="h-8 w-8 mb-2 text-gray-400"
                            />
                            <div className="text-sm font-medium">
                              {camera.name}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              {camera.status === "offline"
                                ? "Камера оффлайн"
                                : "Ошибка подключения"}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Добавляем пустые слоты если камер меньше 4 */}
                    {Array.from({
                      length: Math.max(0, 4 - cameras.length),
                    }).map((_, index) => (
                      <div
                        key={`empty-${index}`}
                        className="bg-gray-800 rounded-lg aspect-video flex items-center justify-center"
                      >
                        <div className="text-center text-gray-400">
                          <Icon name="Plus" className="h-8 w-8 mx-auto mb-2" />
                          <div className="text-sm">Добавить камеру</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Последние события */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Activity" className="h-5 w-5" />
                    Последние события
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {events.slice(0, 6).map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="font-mono text-sm font-medium">
                            {event.plate}
                          </div>
                          <Badge className={getStatusColor(event.status)}>
                            {getStatusText(event.status)}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-500">
                          {event.time}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="database" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Database" className="h-5 w-5" />
                  База данных номеров
                </CardTitle>
                <div className="flex gap-2 mt-4">
                  <Input
                    placeholder="Поиск по номеру..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-sm"
                  />
                  <Dialog open={showAddPlate} onOpenChange={setShowAddPlate}>
                    <DialogTrigger asChild>
                      <Button>Добавить номер</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {editingPlate
                            ? "Редактировать номер"
                            : "Добавить номер"}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Номер ТС</Label>
                          <Input
                            value={newPlate.plate}
                            onChange={(e) =>
                              setNewPlate({
                                ...newPlate,
                                plate: e.target.value,
                              })
                            }
                            placeholder="А123БВ199"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Владелец</Label>
                          <Input
                            value={newPlate.owner}
                            onChange={(e) =>
                              setNewPlate({
                                ...newPlate,
                                owner: e.target.value,
                              })
                            }
                            placeholder="Иванов И.И."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Действует до</Label>
                          <Input
                            type="date"
                            value={newPlate.expires}
                            onChange={(e) =>
                              setNewPlate({
                                ...newPlate,
                                expires: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowAddPlate(false);
                              setEditingPlate(null);
                              setNewPlate({
                                plate: "",
                                owner: "",
                                expires: "",
                              });
                            }}
                          >
                            Отмена
                          </Button>
                          <Button
                            onClick={
                              editingPlate ? handleUpdatePlate : handleAddPlate
                            }
                          >
                            {editingPlate ? "Сохранить" : "Добавить"}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Номер</TableHead>
                      <TableHead>Владелец</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead>Действует до</TableHead>
                      <TableHead>Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDatabase.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-mono">
                          {record.plate}
                        </TableCell>
                        <TableCell>{record.owner}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              record.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {record.status === "active" ? "Активный" : "Истёк"}
                          </Badge>
                        </TableCell>
                        <TableCell>{record.expires}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditPlate(record)}
                            >
                              Изменить
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeletePlate(record.id)}
                            >
                              Удалить
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="FileText" className="h-5 w-5" />
                  Журнал событий
                </CardTitle>
                <div className="flex gap-2 mt-4">
                  <Input
                    placeholder="Поиск по номеру или камере..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-sm"
                  />
                  <Select value={eventFilter} onValueChange={setEventFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все события</SelectItem>
                      <SelectItem value="allowed">Разрешено</SelectItem>
                      <SelectItem value="denied">Запрещено</SelectItem>
                      <SelectItem value="unknown">Неизвестно</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-40"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Время</TableHead>
                      <TableHead>Номер</TableHead>
                      <TableHead>Камера</TableHead>
                      <TableHead>Статус</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>{event.time}</TableCell>
                        <TableCell className="font-mono">
                          {event.plate}
                        </TableCell>
                        <TableCell>{event.camera}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(event.status)}>
                            {getStatusText(event.status)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {canAccess("operator") && (
            <TabsContent value="operator" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="UserCheck" className="h-5 w-5" />
                    Панель оператора КПП
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingEvents.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        Нет событий, требующих подтверждения
                      </div>
                    ) : (
                      pendingEvents.map((event) => (
                        <div
                          key={event.id}
                          className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                        >
                          <div className="flex items-center gap-4">
                            <div className="font-mono text-lg font-bold">
                              {event.plate}
                            </div>
                            <div className="text-sm text-gray-600">
                              {event.camera} • {event.time}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleConfirmEvent(event.id, true)}
                              className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                            >
                              <Icon name="Check" className="h-4 w-4 mr-1" />
                              Подтвердить
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleConfirmEvent(event.id, false)
                              }
                              className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                            >
                              <Icon name="X" className="h-4 w-4 mr-1" />
                              Отклонить
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Settings" className="h-5 w-5" />
                  Настройки системы
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Камеры</h3>
                    <div className="space-y-2">
                      {cameras.slice(0, 3).map((camera) => (
                        <div
                          key={camera.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <span>{camera.name}</span>
                          <Badge
                            className={getCameraStatusColor(camera.status)}
                          >
                            {camera.status === "online"
                              ? "Онлайн"
                              : camera.status === "offline"
                                ? "Оффлайн"
                                : "Ошибка"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Уведомления</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>Telegram уведомления</span>
                        <Button variant="outline" size="sm">
                          Настроить
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>SMS уведомления</span>
                        <Button variant="outline" size="sm">
                          Настроить
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Резервное копирование</span>
                        <Button variant="outline" size="sm">
                          Настроить
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {canAccess("operator") && (
            <TabsContent value="operator" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="CheckCircle" className="h-5 w-5" />
                    Панель оператора КПП
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <h3 className="font-semibold">Требует подтверждения</h3>
                    {mockPendingEvents.map((event) => (
                      <div key={event.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-4">
                            <div className="font-mono text-lg font-bold">
                              {event.plate}
                            </div>
                            <Badge variant="outline">{event.camera}</Badge>
                            <span className="text-sm text-gray-500">
                              {event.timestamp}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">
                              Точность: {event.confidence}%
                            </span>
                            <div
                              className={`w-3 h-3 rounded-full ${event.confidence > 90 ? "bg-green-500" : event.confidence > 70 ? "bg-yellow-500" : "bg-red-500"}`}
                            ></div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleConfirmEvent(event.id, true)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Icon name="Check" className="h-4 w-4 mr-1" />
                            Подтвердить проезд
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleConfirmEvent(event.id, false)}
                          >
                            <Icon name="X" className="h-4 w-4 mr-1" />
                            Отклонить
                          </Button>
                          <Button size="sm" variant="outline">
                            <Icon name="Eye" className="h-4 w-4 mr-1" />
                            Посмотреть видео
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {canAccess("admin") && (
            <TabsContent value="cameras" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Camera" className="h-5 w-5" />
                    Управление IP-камерами
                  </CardTitle>
                  <Dialog open={showAddCamera} onOpenChange={setShowAddCamera}>
                    <DialogTrigger asChild>
                      <Button className="w-fit">
                        <Icon name="Plus" className="h-4 w-4 mr-2" />
                        Добавить камеру
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Добавить IP-камеру</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="camera-name">Название</Label>
                            <Input
                              id="camera-name"
                              value={newCamera.name || ""}
                              onChange={(e) =>
                                setNewCamera({
                                  ...newCamera,
                                  name: e.target.value,
                                })
                              }
                              placeholder="Камера 1"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="camera-location">
                              Местоположение
                            </Label>
                            <Input
                              id="camera-location"
                              value={newCamera.location || ""}
                              onChange={(e) =>
                                setNewCamera({
                                  ...newCamera,
                                  location: e.target.value,
                                })
                              }
                              placeholder="Главный вход"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="camera-ip">IP адрес</Label>
                            <Input
                              id="camera-ip"
                              value={newCamera.ip || ""}
                              onChange={(e) =>
                                setNewCamera({
                                  ...newCamera,
                                  ip: e.target.value,
                                })
                              }
                              placeholder="192.168.1.100"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="camera-port">Порт</Label>
                            <Input
                              id="camera-port"
                              type="number"
                              value={newCamera.port || 554}
                              onChange={(e) =>
                                setNewCamera({
                                  ...newCamera,
                                  port: parseInt(e.target.value),
                                })
                              }
                              placeholder="554"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="camera-protocol">Протокол</Label>
                          <Select
                            value={newCamera.protocol || "ONVIF"}
                            onValueChange={(value) =>
                              setNewCamera({
                                ...newCamera,
                                protocol: value as "ONVIF" | "RTSP",
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ONVIF">ONVIF</SelectItem>
                              <SelectItem value="RTSP">RTSP</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="camera-username">Логин</Label>
                            <Input
                              id="camera-username"
                              value={newCamera.username || ""}
                              onChange={(e) =>
                                setNewCamera({
                                  ...newCamera,
                                  username: e.target.value,
                                })
                              }
                              placeholder="admin"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="camera-password">Пароль</Label>
                            <Input
                              id="camera-password"
                              type="password"
                              value={newCamera.password || ""}
                              onChange={(e) =>
                                setNewCamera({
                                  ...newCamera,
                                  password: e.target.value,
                                })
                              }
                              placeholder="••••••••"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setShowAddCamera(false)}
                          >
                            Отмена
                          </Button>
                          <Button onClick={handleAddCamera}>Добавить</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Название</TableHead>
                        <TableHead>IP адрес</TableHead>
                        <TableHead>Порт</TableHead>
                        <TableHead>Протокол</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead>Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCameras.map((camera) => (
                        <TableRow key={camera.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{camera.name}</div>
                              <div className="text-sm text-gray-500">
                                {camera.location}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono">
                            {camera.ip}
                          </TableCell>
                          <TableCell>{camera.port}</TableCell>
                          <TableCell>{camera.protocol}</TableCell>
                          <TableCell>
                            <Badge
                              className={getCameraStatusColor(camera.status)}
                            >
                              {camera.status === "online"
                                ? "Онлайн"
                                : camera.status === "offline"
                                  ? "Оффлайн"
                                  : "Ошибка"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleTestCamera(camera.id)}
                                disabled={isTestingCamera === camera.id}
                              >
                                {isTestingCamera === camera.id ? (
                                  <Icon
                                    name="Loader2"
                                    className="h-4 w-4 animate-spin"
                                  />
                                ) : (
                                  <Icon name="Play" className="h-4 w-4" />
                                )}
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="destructive" size="sm">
                                    <Icon name="Trash2" className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Удалить камеру?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Это действие нельзя отменить. Камера{" "}
                                      {camera.name} будет удалена навсегда.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Отмена
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleDeleteCamera(camera.id)
                                      }
                                    >
                                      Удалить
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>

      {/* Полноэкранный просмотр камеры */}
      {selectedCamera && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative max-w-6xl max-h-[90vh] w-full mx-4">
            <button
              onClick={() => setSelectedCamera(null)}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-100 transition-all"
            >
              <Icon name="X" className="h-6 w-6" />
            </button>

            {selectedCamera.status === "online" ? (
              <div className="relative bg-gray-900 rounded-lg overflow-hidden">
                <img
                  src={
                    selectedCamera.id === cameras[0]?.id
                      ? "/img/94c64a41-1ac2-46df-9b32-cf6aaa7474f8.jpg"
                      : `https://picsum.photos/1280/720?random=${selectedCamera.id}`
                  }
                  alt={selectedCamera.name}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
                <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded">
                  <div className="font-medium">{selectedCamera.name}</div>
                  <div className="text-sm text-gray-300">
                    {selectedCamera.location}
                  </div>
                </div>
                <div className="absolute top-4 right-16 flex items-center gap-2 bg-black bg-opacity-70 text-white px-4 py-2 rounded">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">LIVE</span>
                </div>
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded">
                  <div className="text-sm">{currentTime}</div>
                  <div className="text-xs text-gray-300">
                    IP: {selectedCamera.ip}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-900 rounded-lg p-12 text-center">
                <Icon
                  name="CameraOff"
                  className="h-16 w-16 mx-auto mb-4 text-gray-400"
                />
                <h3 className="text-white text-xl font-medium mb-2">
                  {selectedCamera.name}
                </h3>
                <p className="text-gray-400">
                  {selectedCamera.status === "offline"
                    ? "Камера оффлайн"
                    : "Ошибка подключения"}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
