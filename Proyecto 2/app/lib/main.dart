import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:socket_io_client/socket_io_client.dart' as IO;
import 'dart:convert';

void main() {
  runApp(const MaterialApp(
    home: HomePage(),
  ));
}

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

const backendURL = 'http://192.168.0.27:3001';

class _HomePageState extends State<HomePage> {
  final timeToWaterController = TextEditingController();
  final soilMoistureController = TextEditingController(text: '0');
  final waterLevelController = TextEditingController(text: '0');
  bool showAlert = false;
  bool firstAlert = false;
  bool powerStatus = false;

  Map data = {};
  var settings = {
    'power': false,
    'timeToWater': 0,
  };

  getSettings() async {
    http.Response response =
        await http.get(Uri.parse('$backendURL/api/settings'));
    data = json.decode(response.body);
    setState(() {
      Map dataSettings = data['settings'][0];
      settings['power'] = dataSettings['power'];
      settings['timeToWater'] = dataSettings['timeToWater'];
      //timeToWaterController.text = settings['timeToWater'].toString();
    });
    debugPrint(settings.toString());
  }

  IO.Socket socket = IO.io(backendURL, <String, dynamic>{
    'autoConnect': false,
    'transports': ['websocket'],
  });

  @override
  void initState() {
    super.initState();
    getSoilMoisture();
    getWaterLevel();
    initSocket();
    getSettings();
  }

  @override
  void dispose() {
    timeToWaterController.dispose();
    soilMoistureController.dispose();
    waterLevelController.dispose();
    socket.disconnected;
    socket.dispose();
    super.dispose();
  }

  getSoilMoisture() async {
    http.Response response =
        await http.get(Uri.parse('$backendURL/api/realTimeData'));
    data = json.decode(response.body);
    setState(() {
      soilMoistureController.text =
          data['realTimeData'][0]['soilMoisture'].toString();
    });
  }

  getWaterLevel() async {
    http.Response response =
        await http.get(Uri.parse('$backendURL/api/realTimeData'));
    data = json.decode(response.body);
    setState(() {
      waterLevelController.text =
          data['realTimeData'][0]['waterLevel'].toString();
    });
  }

  initSocket() {
    socket.connect();
    socket.on('connect', (_) {
      debugPrint('connect');
    });

    socket.onDisconnect((_) => debugPrint('disconnect'));
    socket.onConnectError((err) => debugPrint(err));
    socket.onError((err) => debugPrint(err));
    socket.on('soilMoisture', (data) {
      if (data > 80 && !firstAlert) {
        setState(() {
          showAlert = true;
          firstAlert = true;
        });
      }

      if (data < 80) {
        setState(() {
          firstAlert = false;
        });
      }

      setState(() {
        soilMoistureController.text = data.toString();
      });
    });

    socket.on('waterLevel', (data) {
      setState(() {
        waterLevelController.text = data.toString();
      });
    });

    socket.on(
        'power',
        (data) => {
              setState(() {
                powerStatus = data;
              })
            });
  }

  void dismissAlert() {
    setState(() {
      showAlert = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    debugPrint('Alerta: $showAlert');
    debugPrint('Primera alerta: $firstAlert');

    if (showAlert) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        showDialog(
            context: context,
            builder: (context) {
              return AlertDialog(
                title: const Text('Alerta'),
                content: const Text('La humedad del suelo supera el 80%'),
                actions: [
                  TextButton(
                      onPressed: () {
                        dismissAlert();
                        Navigator.of(context).pop();
                      },
                      child: const Text('Aceptar'))
                ],
              );
            });
      });
    }

    return Scaffold(
        appBar: AppBar(
          title: const Text('Grupo 20 ACE2'),
          backgroundColor: Colors.indigo[900],
        ),
        body: ListView(
          children: [
            const Padding(
                padding: EdgeInsets.all(16.0),
                child: Text(
                  'Sistema De Riego',
                  style: TextStyle(fontSize: 22.0, color: Colors.indigo),
                )),
            Row(
              children: [
                const Padding(
                    padding: EdgeInsets.only(left: 16.0, right: 2, top: 12),
                    child: Text(
                      'Estado: ',
                      style: TextStyle(fontSize: 20.0),
                    )),
                Padding(
                    padding: const EdgeInsets.only(left: 2, top: 12),
                    child: Text(
                      powerStatus ? 'Encendido' : 'Apagado',
                      style: const TextStyle(
                          fontSize: 20.0, fontWeight: FontWeight.bold),
                    )),
              ],
            ),
            Row(
              children: [
                const Padding(
                    padding: EdgeInsets.only(left: 16.0, right: 2, top: 12),
                    child: Text(
                      'Tiempo de riego: ',
                      style: TextStyle(fontSize: 20.0),
                    )),
                Padding(
                    padding: const EdgeInsets.only(left: 2, top: 12),
                    child: Text(
                      '${settings['timeToWater']}s',
                      style: const TextStyle(
                          fontSize: 20.0, fontWeight: FontWeight.bold),
                    )),
              ],
            ),
            Row(
              children: [
                const Padding(
                    padding: EdgeInsets.only(left: 16.0, right: 2, top: 12),
                    child: Text(
                      'Humedad actual: ',
                      style: TextStyle(fontSize: 20.0),
                    )),
                Padding(
                  padding: const EdgeInsets.only(left: 2, top: 12),
                  child: Text(
                    '${soilMoistureController.text}%',
                    style: const TextStyle(
                        fontSize: 20.0, fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
            Row(
              children: [
                const Padding(
                    padding: EdgeInsets.only(
                        left: 16.0, right: 2, top: 12, bottom: 12),
                    child: Text(
                      'Nivel de agua: ',
                      style: TextStyle(fontSize: 20.0),
                    )),
                Padding(
                  padding: const EdgeInsets.only(left: 2, top: 12, bottom: 12),
                  child: Text(
                    '${waterLevelController.text}%',
                    style: const TextStyle(
                        fontSize: 20.0, fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
            Row(mainAxisAlignment: MainAxisAlignment.spaceEvenly, children: [
              ElevatedButton(
                  onPressed: () async {
                    http.Response response = await http
                        .put(Uri.parse('$backendURL/api/settings/modifyPower'),
                            body: json.encode({
                              "power": true,
                            }),
                            headers: {"Content-Type": "application/json"});
                    getSettings();
                    debugPrint(response.body);
                  },
                  style: ButtonStyle(
                      backgroundColor: powerStatus == true
                          ? MaterialStateProperty.all<Color>(
                              const Color.fromARGB(255, 2, 167, 151))
                          : MaterialStateProperty.all<Color>(
                              const Color.fromARGB(255, 0, 116, 104))),
                  child: const Text('Encender')),
              ElevatedButton(
                  onPressed: () async {
                    http.Response response = await http
                        .put(Uri.parse('$backendURL/api/settings/modifyPower'),
                            body: json.encode({
                              "power": false,
                            }),
                            headers: {"Content-Type": "application/json"});
                    getSettings();
                    debugPrint(response.body);
                  },
                  style: ButtonStyle(
                      backgroundColor: powerStatus == true
                          ? MaterialStateProperty.all<Color>(
                              const Color.fromARGB(255, 186, 11, 2))
                          : MaterialStateProperty.all<Color>(
                              const Color.fromARGB(255, 216, 12, 1))),
                  child: const Text('Apagar'))
            ]),
            const Padding(
                padding: EdgeInsets.only(left: 16.0, right: 16.0, top: 16.0),
                child: Text(
                  'Establecer tiempo de riego',
                  style: TextStyle(fontSize: 18.0),
                )),
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: TextField(
                controller: timeToWaterController,
                keyboardType: TextInputType.number,
                decoration:
                    const InputDecoration(hintText: 'Tiempo de riego (s)'),
              ),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                ElevatedButton(
                    onPressed: () {
                      timeToWaterController.text = '5';
                    },
                    style: ButtonStyle(
                        backgroundColor: MaterialStateProperty.all<Color>(
                            Colors.yellow[700]!),
                        foregroundColor:
                            MaterialStateProperty.all<Color>(Colors.black)),
                    child: const Text('5')),
                const SizedBox(width: 10),
                ElevatedButton(
                  onPressed: () {
                    timeToWaterController.text = '10';
                  },
                  style: ButtonStyle(
                      backgroundColor:
                          MaterialStateProperty.all<Color>(Colors.yellow[700]!),
                      foregroundColor:
                          MaterialStateProperty.all<Color>(Colors.black)),
                  child: const Text('10'),
                ),
                const SizedBox(width: 10),
                ElevatedButton(
                  onPressed: () {
                    timeToWaterController.text = '15';
                  },
                  style: ButtonStyle(
                      backgroundColor:
                          MaterialStateProperty.all<Color>(Colors.yellow[700]!),
                      foregroundColor:
                          MaterialStateProperty.all<Color>(Colors.black)),
                  child: const Text('15'),
                ),
                const SizedBox(width: 10),
                ElevatedButton(
                  onPressed: () {
                    timeToWaterController.text = '20';
                  },
                  style: ButtonStyle(
                      backgroundColor:
                          MaterialStateProperty.all<Color>(Colors.yellow[700]!),
                      foregroundColor:
                          MaterialStateProperty.all<Color>(Colors.black)),
                  child: const Text('20'),
                ),
              ],
            ),
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: ElevatedButton(
                  onPressed: () async {
                    http.Response response = await http.put(
                        Uri.parse('$backendURL/api/settings/modifyTime'),
                        body: json.encode({
                          "timeToWater":
                              int.tryParse(timeToWaterController.text) ?? 0
                        }),
                        headers: {"Content-Type": "application/json"});
                    getSettings();
                    debugPrint(response.body);
                  },
                  style: ButtonStyle(
                      backgroundColor: MaterialStateProperty.all<Color>(
                          Colors.indigo[500]!)),
                  child: const Text('Establecer')),
            )
          ],
        ));
  }
}
