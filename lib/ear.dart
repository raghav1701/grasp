import 'package:flutter/material.dart';

class Ear extends StatefulWidget {
  @override
  _EarState createState() => _EarState();
}

class _EarState extends State<Ear> {
  @override
  Widget build(BuildContext context) {
    return new Scaffold(
      appBar: new AppBar(
        title: new Text("Ear Page"),
      ),
      body: new Center(
        child: new Text("Ear Page"),
      ),
    );
  }
}
