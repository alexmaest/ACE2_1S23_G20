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
    initSocket();
    super.initState();
    getSettings();
  }

  @override
  void dispose() {
    timeToWaterController.dispose();
    super.dispose();
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
      debugPrint(data.toString());
      setState(() {
        soilMoistureController.text = data.toString();
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    String powerStatus = settings['power'] == true ? 'Encendido' : 'Apagado';
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
                      powerStatus,
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
                    padding: EdgeInsets.only(
                        left: 16.0, right: 2, top: 12, bottom: 12),
                    child: Text(
                      'Humedad actual: ',
                      style: TextStyle(fontSize: 20.0),
                    )),
                Padding(
                    padding:
                        const EdgeInsets.only(left: 2, top: 12, bottom: 12),
                    child: Text(
                      '${soilMoistureController.text}%',
                      style: const TextStyle(
                          fontSize: 20.0, fontWeight: FontWeight.bold),
                    )),
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
                      backgroundColor: settings['power'] == true
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
                      backgroundColor: settings['power'] == true
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
