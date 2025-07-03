import 'package:flutter/material.dart';

Widget build(BuildContext ctx) {
  final factory = Theme.of(ctx).platform == TargetPlatform.iOS
      ? CupertinoFactory()
      : MaterialFactory();
  return factory.createButton(...);
}

