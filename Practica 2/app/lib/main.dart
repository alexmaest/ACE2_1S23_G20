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
  final backendURL = 'http://10.0.2.2:3001';
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
      timeToWaterController.text = settings['timeToWater'].toString();
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
    return Scaffold(
        appBar: AppBar(
          title: const Text('Grupo 20'),
          backgroundColor: Colors.indigo[900],
        ),
        body: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Padding(
                padding: EdgeInsets.all(16.0),
                child: Text(
                  'Sistema De Riego',
                  style: TextStyle(fontSize: 24.0),
                )),
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
                      backgroundColor:
                          MaterialStateProperty.all<Color>(Colors.green)),
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
                      backgroundColor:
                          MaterialStateProperty.all<Color>(Colors.red)),
                  child: const Text('Apagar'))
            ]),
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
