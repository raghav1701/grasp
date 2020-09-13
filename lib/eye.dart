import 'package:flutter/material.dart';

class Eye extends StatefulWidget {
  @override
  _EyeState createState() => _EyeState();
}

class _EyeState extends State<Eye> {
  @override
  Widget build(BuildContext context) {
    return new Scaffold(
      appBar: new AppBar(
        title: new Text("Eye Page"),
      ),
      body: new Center(
        child: new Text("Eye Page"),
      ),
    );
  }
}
