import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

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
  getSettings() async {
    http.Response response =
        await http.get(Uri.parse('http://localhost:3001/api/settings'));
    debugPrint(response.body);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('ACE2'),
        backgroundColor: Colors.indigo[900],
      ),
      body: const Center(
        child: Text('Grupo 20'),
      ),
    );
  }
}
