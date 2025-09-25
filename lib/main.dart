
import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  MobileAds.instance.initialize();
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: HomePage(),
    );
  }
}

class HomePage extends StatefulWidget {
  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  late BannerAd _bannerAd;
  bool _isBannerAdReady = false;

  late InterstitialAd _interstitialAd;
  bool _isInterstitialAdReady = false;

  late final WebViewController _controller;

  @override
  void initState() {
    super.initState();

    // ✅ Banner Ad
    _bannerAd = BannerAd(
      adUnitId: "ca-app-pub-8223246456088610/3971118029", // <-- अपनी Banner Ad Unit ID डालें
      request: AdRequest(),
      size: AdSize.banner,
      listener: BannerAdListener(
        onAdLoaded: (_) {
          setState(() {
            _isBannerAdReady = true;
          });
        },
        onAdFailedToLoad: (ad, error) {
          ad.dispose();
          print("Banner Ad failed: $error");
        },
      ),
    )..load();

    // ✅ Interstitial Ad (Full Screen Ad)
    InterstitialAd.load(
      adUnitId: "ca-app-pub-3940256099942544/1033173712", // <-- Test ID (बाद में अपनी ID डालें)
      request: AdRequest(),
      adLoadCallback: InterstitialAdLoadCallback(
        onAdLoaded: (ad) {
          _interstitialAd = ad;
          _isInterstitialAdReady = true;
        },
        onAdFailedToLoad: (error) {
          print("Interstitial failed: $error");
          _isInterstitialAdReady = false;
        },
      ),
    );

    // ✅ WebViewController
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..loadRequest(Uri.parse("https://sachinchandela101-ai.github.io/Math-Practice-Set-/")); // <-- अपना GitHub Pages URL डालें
  }

  @override
  void dispose() {
    _bannerAd.dispose();
    if (_isInterstitialAdReady) {
      _interstitialAd.dispose();
    }
    super.dispose();
  }

  void _showInterstitialAd() {
    if (_isInterstitialAdReady) {
      _interstitialAd.show();
      _isInterstitialAdReady = false;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Mock Test App"),
        actions: [
          IconButton(
            icon: Icon(Icons.ad_units),
            onPressed: _showInterstitialAd, // ✅ बटन दबाने पर full-screen ad खुलेगा
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: WebViewWidget(controller: _controller),
          ),
          if (_isBannerAdReady)
            Container(
              height: _bannerAd.size.height.toDouble(),
              child: AdWidget(ad: _bannerAd),
            ),
        ],
      ),
    );
  }
}
