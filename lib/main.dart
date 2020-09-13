import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return new MaterialApp(
      home: MyBottomNavigation(),
    );
  }
}

class MyBottomNavigation extends StatefulWidget {
  @override
  _MyBottomNavigationState createState() => _MyBottomNavigationState();
}

class _MyBottomNavigationState extends State<MyBottomNavigation> {
  int _currentindex = 0;
  final List<Widget> _children = [];

  void onTappedbar(int index) {
    setState(() {
      _currentindex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return new Scaffold(
      body: _children[_currentindex],
      bottomNavigationBar: BottomNavigationBar(
        onTap: onTappedbar,
        currentIndex: _currentindex,
        items: [
          BottomNavigationBarItem(
              icon: new Icon(Icons.home), title: new Text("Home")),
          BottomNavigationBarItem(
              icon: new Icon(Icons.home), title: new Text("Eye Care")),
          BottomNavigationBarItem(
              icon: new Icon(Icons.home), title: new Text("Ear Care")),
          BottomNavigationBarItem(
              icon: new Icon(Icons.settings), title: new Text("Settings")),
        ],
      ),
    );
  }
}
