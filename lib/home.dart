import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/semantics.dart';

class HomePage extends StatefulWidget {
  @override
  _HomePageState createState() => _HomePageState();
}

var Slideritems = ["A", "B", "C"];
var Sliderimages = [
  "assets/images/1.jpg",
  "assets/images/2.jpg",
  "assets/images/3.jpg"
];

class _HomePageState extends State<HomePage> {
  @override
  Widget build(BuildContext context) {
    var screenHeight = MediaQuery.of(context).size.height;
    var screenWidth = MediaQuery.of(context).size.width;
    return new Scaffold(
      body: Container(
        height: screenHeight,
        width: screenWidth,
        child: SafeArea(
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: <Widget>[
                Padding(
                  padding: const EdgeInsets.fromLTRB(10, 5, 10, 5),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: <Widget>[Text("Home")],
                  ),
                ),
                SliderView()
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class SliderView extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    var screenHeight = MediaQuery.of(context).size.height;
    var screenWidth = MediaQuery.of(context).size.width;

    PageController controller =
        PageController(viewportFraction: 0.8, initialPage: 1);
    List<Widget> Sliders = new List<Widget>();

    for (int x = 0; x < Slideritems.length; x++) {
      var Slideview = Padding(
        padding: EdgeInsets.all(10),
        child: Container(
          child: Stack(
            fit: StackFit.expand,
            children: <Widget>[
              Container(
                decoration: BoxDecoration(
                    borderRadius: BorderRadius.all(Radius.circular(20.0)),
                    boxShadow: [
                      BoxShadow(
                          color: Colors.black38,
                          offset: Offset(2.0, 2.0),
                          blurRadius: 5.0,
                          spreadRadius: 1.0)
                    ]),
              ),
              ClipRRect(
                borderRadius: BorderRadius.all(Radius.circular(20.0)),
                child: Image.asset(
                  Sliderimages[x],
                  fit: BoxFit.cover,
                ),
              ),
              Container(
                decoration: BoxDecoration(
                    borderRadius: BorderRadius.all(Radius.circular(20.0)),
                    gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [Colors.transparent, Colors.black])),
              ),
              Padding(
                padding: EdgeInsets.all(10.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.end,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Text(
                      Slideritems[x],
                      style: TextStyle(fontSize: 25.0, color: Colors.white),
                    )
                  ],
                ),
              )
            ],
          ),
        ),
      );
      Sliders.add(Slideview);
    }
    return Container(
      width: screenWidth,
      height: screenHeight * 5 / 16,
      child: PageView(
        controller: controller,
        scrollDirection: Axis.horizontal,
        children: Sliders,
      ),
    );
  }
}

class Clipss extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return new Scaffold(
      body: new Padding(
        padding: const EdgeInsets.all(8.0),
        child: new Center(
          child: new ClipPath(
            child: new Image.network(src),
            clipper: new MyClipper(),
          ),
        ),
      ),
    );
  }
}

class MyClipper extends CustomClipper<Path> {
  @override
  Path getClip(Size size) {
    var path = new Path();
    path.lineTo(0.0, size.height - 20);

    var firstEndPoint = new Offset(size.width / 2.25, size.height - 30);
    var firstcontrolpoint = new Offset(size.width / 4, size.height);
    path.quadraticBezierTo(firstcontrolpoint.dx, firstcontrolpoint.dy,
        firstEndPoint.dx, firstEndPoint.dy);

    var secondEndPoint = new Offset(size.width, size.height - 40);
    var secondcontrolpoint =
        new Offset((size.width) - (size.width / 3.25), size.height - 65);
    path.quadraticBezierTo(secondcontrolpoint.dx, secondcontrolpoint.dy,
        secondEndPoint.dx, secondEndPoint.dy);

    path.lineTo(size.width, size.height - 40);
    path.lineTo(size.width, 0.0);
    path.close();
    return path;
  }

  @override
  bool shouldReclip(CustomClipper<Path> oldClipper) => false;
}
