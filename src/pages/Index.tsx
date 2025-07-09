import { useState } from "react";
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
import Icon from "@/components/ui/icon";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Моковые данные для демонстрации
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Система контроля доступа
          </h1>
          <p className="text-gray-600">
            Мониторинг автотранспорта по государственным номерам
          </p>
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="monitoring">Мониторинг</TabsTrigger>
            <TabsTrigger value="database">База номеров</TabsTrigger>
            <TabsTrigger value="events">События</TabsTrigger>
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
                    <div className="bg-gray-800 rounded-lg aspect-video flex items-center justify-center">
                      <img
                        src="/img/94c64a41-1ac2-46df-9b32-cf6aaa7474f8.jpg"
                        alt="Камера 1"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="bg-gray-800 rounded-lg aspect-video flex items-center justify-center">
                      <div className="text-white text-sm">Камера 2</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg aspect-video flex items-center justify-center">
                      <div className="text-white text-sm">Камера 3</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg aspect-video flex items-center justify-center">
                      <div className="text-white text-sm">Камера 4</div>
                    </div>
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
                    {mockEvents.slice(0, 6).map((event) => (
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
                  <Button>Добавить номер</Button>
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
                    {mockDatabase.map((record) => (
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
                            <Button variant="outline" size="sm">
                              Изменить
                            </Button>
                            <Button variant="destructive" size="sm">
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
                    {mockEvents.map((event) => (
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
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span>Камера 1 (Вход)</span>
                        <Badge className="bg-green-100 text-green-800">
                          Онлайн
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span>Камера 2 (Выход)</span>
                        <Badge className="bg-green-100 text-green-800">
                          Онлайн
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span>Камера 3 (Парковка)</span>
                        <Badge className="bg-red-100 text-red-800">
                          Офлайн
                        </Badge>
                      </div>
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
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
