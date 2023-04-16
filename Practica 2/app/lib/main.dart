import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
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

class _HomePageState extends State<HomePage> {
  final timeToWaterController = TextEditingController();
  final backendURL = 'http://192.168.0.27:3001';
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

  @override
  void initState() {
    super.initState();
    getSettings();
  }

  @override
  void dispose() {
    timeToWaterController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    String powerStatus = settings['power'] == true ? 'Encendido' : 'Apagado';
    return Scaffold(
        appBar: AppBar(
          title: const Text('Grupo 20 ACE2'),
          backgroundColor: Colors.indigo[900],
        ),
        body: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
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
                    padding: EdgeInsets.only(
                        left: 16.0, right: 2, top: 12, bottom: 12),
                    child: Text(
                      'Tiempo de riego: ',
                      style: TextStyle(fontSize: 20.0),
                    )),
                Padding(
                    padding:
                        const EdgeInsets.only(left: 2, top: 12, bottom: 12),
                    child: Text(
                      '${settings['timeToWater']}s',
                      style: const TextStyle(
                          fontSize: 20.0, fontWeight: FontWeight.bold),
                    )),
              ],
            ),
            Row(mainAxisAlignment: MainAxisAlignment.spaceEvenly, children: [
              ElevatedButton(
                  onPressed: () async {
                    http.Response response = await http.put(
                        Uri.parse('$backendURL/api/settings/modify'),
                        body: json.encode({
                          "power": true,
                          "timeToWater":
                              int.tryParse(timeToWaterController.text) ?? 0
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
                    http.Response response = await http.put(
                        Uri.parse('$backendURL/api/settings/modify'),
                        body: json.encode({
                          "power": false,
                          "timeToWater":
                              int.tryParse(timeToWaterController.text) ?? 0
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
            )
          ],
        ));
  }
}
