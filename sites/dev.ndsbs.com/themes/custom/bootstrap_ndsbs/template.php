<?php

/**
 * @file
 * Process theme data for bootstrap_ndsbs.
 */

include 'src/NDSBS.php';
use Drupal\ndsbs\NDSBS;

/**
 * Load NDSBS's include files for theme processing.
 */
NDSBS::ndsbs_load_include('inc', 'bootstrap_ndsbs', 'preprocess', 'includes');
NDSBS::ndsbs_load_include('inc', 'bootstrap_ndsbs', 'process', 'includes');
NDSBS::ndsbs_load_include('inc', 'bootstrap_ndsbs', 'theme', 'includes');
NDSBS::ndsbs_load_include('inc', 'bootstrap_ndsbs', 'alter', 'includes');
