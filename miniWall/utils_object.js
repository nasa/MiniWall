/*
 * Michael Schuh
 * NASA Ames Research Center Code AA
 * Moffett Field, CA 94035
 *
 * Update the get_image_root_name_from_cell_column_and_row_names() function to work with your data set.
 *
 * MiniWall Software
 * 2020-04-30 Version 3.1 Release for NASA GitHub site.
 * 2018-07-16 Version 2.3 First version for software release.
 * 2016-05-23 Version 2.2 Added "use strict"; call.
 * 2016-04-14 Version 2.1 Inspired by the MiniWall created by John Melton in 2006 and reworked by Paul Stremel
 *
 * Notices:
 *
 * Copyright (C) 2020 United States Government as represented by the
 * Administrator of the National Aeronautics and Space Administration.
 * All Rights Reserved.
 *
 * Disclaimers
 *
 * No Warranty: The subject software is provided "as is" without any warranty
 * of any kind, either expressed, implied, or statutory, including, but
 * not limited to, any warranty that the subject software will conform to
 * specifications, any implied warranties of merchantability, fitness for a
 * particular purpose, or freedom from infringement, any warranty that the
 * subject software will be error free, or any warranty that documentation,
 * if provided, will conform to the subject software. This agreement does
 * not, in any manner, constitute an endorsement by government agency
 * or any prior recipient of any results, resulting designs, hardware,
 * software products or any other applications resulting from use of the
 * subject software.  Further, government agency disclaims all warranties
 * and liabilities regarding third-party software, if present in the original
 * software, and distributes it "as is."
 *
 * Waiver and Indemnity:  Recipient agrees to waive any and all claims
 * against the united states government, its contractors and subcontractors,
 * as well as any prior recipient.  If recipient's use of the subject
 * software results in any liabilities, demands, damages, expenses or losses
 * arising from such use, including any damages from products based on,
 * or resulting from, recipient's use of the subject software, recipient
 * shall indemnify and hold harmless the united states government, its
 * contractors and subcontractors, as well as any prior recipient, to the
 * extent permitted by law.  Recipient's sole remedy for any such matter
 * shall be the immediate, unilateral termination of this agreement.
 */
"use strict";
var image_select_id = "image_select";
var scale_slider_id = "scale_slider";
var scale_slider_div_id = "slider_value";
var image_width = 1200;
var image_height = 800;
var image_resize_scale_delta = 1;
// Small pink boxes show when a table row or column are hidden and are used to unhide them.
var row_column_hidden_box_size_in_pixels = "10px";
var row_column_hidden_box_color = "pink";
var initial_size_in_percent = undefined;
var size_in_percent = undefined;
var object_table_transposed = undefined;  // Is the table transposed?
var initial_object_table_transposed = undefined;
var selected_image_index = undefined;
var selected_image = undefined;
// Configurations selector
var has_configurations = false;
var configurations = undefined;
var configuration_select_id = "configuration_select";
var selected_configuration_index = undefined;
var initial_selected_configuration_index = undefined;
// Mach Number selector
var has_mach_numbers = false;
var mach_numbers = undefined;
var mach_number_select_id = "mach_number_select";
var selected_mach_number_index = undefined;
var initial_selected_mach_number_index = undefined;
//
var help_windows = new Object();
var initial_image_index = undefined;
var images = undefined;
var multi_image_windows = new Object();
var image_windows = new Object();
var image_windows_image = new Object();
var link_single_image_windows = false;
var link_single_image_windows_resize_events = false;
var last_link_single_image_windows_resize_events_size = undefined;
var link_all_image_windows = false;
var initial_multi_image_window_images_scale_value_in_percent = 20;
// path relative the the main html page to directory with the images.
var image_directory_path = undefined;
var image_directory_path_default = false;
// Use the miniwall_type variable to control which tabs are used and how the image names
// are created for the main image cell images.
var miniwall_type = undefined;


// Return the base name of the image from the column and row names.
function get_image_root_name_from_cell_column_and_row_names(configuration_basename,
  column_label_prefix, column_value, row_data_set){

  var root = "";
  var row_data_set_parts = row_data_set.split(":");

  // This is where the full path to the image is created using the row_data_set and the column_value
  // for each cell in the table.  Customize this section for your MiniWall.  Below are customizations
  // for a dozen different MiniWalls.  You can look through these for ideas on how to customize this
  // method to work with your data.  The "root" is the base of the image name for all of the MiniWall
  // images.
  if ( miniwall_type  == "venting" ) {
    // This is what was used for the FML venting project.
    if ( image_directory_path_default ) {
      image_directory_path="./images/miniWall/";  // path to directory with the images.
    }
    var ventName = row_data_set_parts[0];
    var machName = row_data_set_parts[1];
    var pte_Name = row_data_set_parts[2];
    var tte_Name = row_data_set_parts[3];
    var tratName = row_data_set_parts[4];
    var blvrName = row_data_set_parts[5];
    var baseName = row_data_set_parts[6];
    var meshName = row_data_set_parts[7];
    var coupledAndRestOfName = row_data_set_parts[8];
    var simBaseName = configuration_basename;
    if ( ventName.search("VentA") >= 0 ) simBaseName = "20140523_FML";
    root  = simBaseName + "_" + ventName + "_" + machName + "_" + pte_Name + "_";
    root += tte_Name + "_" + tratName + "_" + column_label_prefix + column_value + "_" + blvrName;
    root += "_" + baseName + "_" + meshName + "_Poly_" + coupledAndRestOfName + "_";  
  } else if ( miniwall_type == "cdep" ) {
    has_mach_numbers = false;
    // This is what was used for the SCB CDep project, April 2019
    if ( image_directory_path_default ) {
      image_directory_path="./images/";  // path to directory with the images.
    }
    // 20190311_CDep_cold-fin-twisted-in-pipe_base0.005_ppm3000_scfm0.20_iTemp300_fti124_ts0.01_mesh1.8_laminar
    // row_data_sets.push("CDep:cold-fin-twisted-in-pipe:base0.005:ppm3000:iTemp300:fti124:ts0.01:mesh1.8_laminar:extra text");
    //                      0             1                2          3       4       5       6       7               8
    var projectName = row_data_set_parts[0];
    var finName = row_data_set_parts[1];
    var base = row_data_set_parts[2];
    var ppm = row_data_set_parts[3];
    var iTemp = row_data_set_parts[4];
    var fti = row_data_set_parts[5];
    var ts = row_data_set_parts[6];
    var meshName = row_data_set_parts[7];
    var coupledAndRestOfName = row_data_set_parts[8];

    var simBaseName = configuration_basename;

    root = [simBaseName, projectName, finName, base, ppm, "scfm" + column_value, iTemp, fti, ts, meshName].join("_") + "/";
  } else if ( miniwall_type == "cdep_time_step" ) {
    has_mach_numbers = false;
    // This is what was used for the SCB CDep project for time step versus mesh density miniWall, March 2019
    if ( image_directory_path_default ) {
      image_directory_path="./images/";  // path to directory with the images.
    }
    // 20190311_CDep_cold-fin-twisted-in-pipe_base0.005_ppm3000_scfm0.20_iTemp300_fti124_ts0.01_mesh1.8_laminar
    // row_data_sets.push("CDep:cold-fin-twisted-in-pipe:base0.005:ppm3000:iTemp300:fti124:ts0.01:mesh1.8_laminar:extra text");
    //                      0             1                2          3       4       5       6       7               8
    var projectName = row_data_set_parts[0];
    var finName = row_data_set_parts[1];
    var base = row_data_set_parts[2];
    var ppm = row_data_set_parts[3];
    var flow_rate = row_data_set_parts[4];
    var iTemp = row_data_set_parts[5];
    var fti = row_data_set_parts[6];
    var meshName = row_data_set_parts[7];
    var coupledAndRestOfName = row_data_set_parts[8];

    var simBaseName = configuration_basename;

    root = [simBaseName, projectName, finName, base, ppm, flow_rate, iTemp, fti, "ts" + column_value, meshName].join("_") + "/";
  } else if ( miniwall_type == "cdep_meshing" ) {
    has_mach_numbers = false;
    // This is what was used for the SCB CDep project for time step versus mesh density miniWall, March 2019
    if ( image_directory_path_default ) {
      image_directory_path="./images/";  // path to directory with the images.
    }
    // 20190311_CDep_cold-fin-twisted-in-pipe_base0.005_ppm3000_scfm0.20_iTemp300_fti124_ts0.01_mesh1.8_laminar
    // row_data_sets.push("CDep:4in-10rings-meshing-v1.1-lower-k-h2o:base0.005:ppm3000:scfm6.00:iTemp141:fti124:ts0.01:mesh1.25_meshOnly_thin-mesher:html");
    // row_data_sets.push("CDep:cold-fin-twisted-in-pipe:base0.005:ppm3000:iTemp300:fti124:ts0.01:mesh1.8_laminar:extra text");
    //                      0             1                2          3       4       5       6       7               8
    var projectName = row_data_set_parts[0];
    var finName = row_data_set_parts[1];
    var base = row_data_set_parts[2];  // The base size read in for this miniWall type is ignored.
    var ppm = row_data_set_parts[3];
    var flow_rate = row_data_set_parts[4];
    var iTemp = row_data_set_parts[5];
    var fti = row_data_set_parts[6];
    var time_step = row_data_set_parts[7];
    var meshName = row_data_set_parts[8];
    var coupledAndRestOfName = row_data_set_parts[9];

    var simBaseName = configuration_basename;

    root = [simBaseName, projectName, finName, "base" + column_value, ppm, flow_rate, iTemp, fti, time_step, meshName].join("_") + "/";
  } else if ( miniwall_type == "nettie_coherence" ) {
    has_mach_numbers = false;
    // This is what was used for the SCB CDep project, April 2019
    if ( image_directory_path_default ) {
      image_directory_path="./images/";  // path to directory with the images.
    }
    // 20190311_CDep_cold-fin-twisted-in-pipe_base0.005_ppm3000_scfm0.20_iTemp300_fti124_ts0.01_mesh1.8_laminar
    // row_data_sets.push("CDep:cold-fin-twisted-in-pipe:base0.005:ppm3000:iTemp300:fti124:ts0.01:mesh1.8_laminar:extra text");
    // row_data_sets.push("301415:<b><font color=yellow>Mach 0.91</font></b> - 2008:22");
    //                      0             1                
    var imageDir = row_data_set_parts[0];
    var restOfName = row_data_set_parts[1];
    var run_number = row_data_set_parts[2];

    root = configuration_basename + "/" + imageDir + "/" + "t11-0377-" + imageDir + "-" + column_value + "Hz-ms";
  } else if ( miniwall_type == "nettie_kulite" ) {
    has_mach_numbers = false;
    // This is what was used for the SCB CDep project, April 2019
    if ( image_directory_path_default ) {
      image_directory_path="./images/";  // path to directory with the images.
    }
    // 20190311_CDep_cold-fin-twisted-in-pipe_base0.005_ppm3000_scfm0.20_iTemp300_fti124_ts0.01_mesh1.8_laminar
    // row_data_sets.push("CDep:cold-fin-twisted-in-pipe:base0.005:ppm3000:iTemp300:fti124:ts0.01:mesh1.8_laminar:extra text");
    // row_data_sets.push("301415:<b><font color=yellow>Mach 0.91</font></b> - 2008:22");
    //                      0             1                
    var imageDir = row_data_set_parts[0];
    var restOfName = row_data_set_parts[1];
    var run_number = row_data_set_parts[2];

    root = configuration_basename + "/" + imageDir + "/" + "t11-0377-" + imageDir + "-kulite-K" + column_value + "-";
  } else if ( miniwall_type == "cdep_time_step" ) {
    has_mach_numbers = false;
    // This is what was used for the SCB CDep project for time step versus mesh density miniWall, March 2019
    if ( image_directory_path_default ) {
      image_directory_path="./images/";  // path to directory with the images.
    }
    // 20190311_CDep_cold-fin-twisted-in-pipe_base0.005_ppm3000_scfm0.20_iTemp300_fti124_ts0.01_mesh1.8_laminar
    // row_data_sets.push("CDep:cold-fin-twisted-in-pipe:base0.005:ppm3000:iTemp300:fti124:ts0.01:mesh1.8_laminar:extra text");
    //                      0             1                2          3       4       5       6       7               8
    var projectName = row_data_set_parts[0];
    var finName = row_data_set_parts[1];
    var base = row_data_set_parts[2];
    var ppm = row_data_set_parts[3];
    var flow_rate = row_data_set_parts[4];
    var iTemp = row_data_set_parts[5];
    var fti = row_data_set_parts[6];
    var meshName = row_data_set_parts[7];
    var coupledAndRestOfName = row_data_set_parts[8];

    var simBaseName = configuration_basename;

    root = [simBaseName, projectName, finName, base, ppm, flow_rate, iTemp, fti, "ts" + column_value, meshName].join("_") + "/";
  } else if ( miniwall_type == "aurora" ) {
    // This is what was used for the Aurora D8 project
    if ( image_directory_path_default ) {
      image_directory_path="./images/";  // path to directory with the images.
    }
    //20160603_CG747_L1012f_P11cncm_Sep10.0_G20_AoA3_Beta0_Alt35_KTAS385_Base140.0_Mesh9.80@12000_Force_Coefficients_ForceCoefficients.png
    // baseline-beaver_half-span_a06_b00_M0.78_h45_base0.60_mesh1.4
    // row_data_sets.push("baseline-beaver:half-span:b00:M0.78:h45:base0.60:mesh1.4, Finer Mesh");
    //                           0             1      2     3   4      5         6
    var aircraftName = row_data_set_parts[0];
    var configName = row_data_set_parts[1];
    var betaName = row_data_set_parts[2];
    var speedName = row_data_set_parts[3];
    var altitudeName = row_data_set_parts[4];
    var baseName = row_data_set_parts[5];
    var meshName = row_data_set_parts[6];
    var coupledAndRestOfName = row_data_set_parts[7];

    var simBaseName = configuration_basename;

    root  = simBaseName;
    root += "_" + aircraftName;
    root = aircraftName;
    root += "_" + configName;
    root += "_" + "a" + column_value;
    //root += "_" + aoaName;
    root += "_" + betaName;
    root += "_" + speedName;
    root += "_" + altitudeName;
    root += "_" + baseName;
    root += "_" + meshName;
    root += "/";
  } else if ( miniwall_type == "virgin" ) {
    // This is what was used for the Virgin Galactic project.
    if ( image_directory_path_default ) {
      image_directory_path="./images/";  // path to directory with the images.
    }
    //20160603_CG747_L1012f_P11cncm_Sep10.0_G20_AoA3_Beta0_Alt35_KTAS385_Base140.0_Mesh9.80@12000_Force_Coefficients_ForceCoefficients.png
    var aircraftName = row_data_set_parts[0];
    var l1Name = row_data_set_parts[1];
    var pylonName = row_data_set_parts[2];
    var separationName = row_data_set_parts[3];
    var gammaName = row_data_set_parts[4];
    var betaName = row_data_set_parts[5];
    var altitudeName = row_data_set_parts[6];
    var speedName = row_data_set_parts[7];
    var baseName = row_data_set_parts[8];
    var meshName = row_data_set_parts[9];
    var coupledAndRestOfName = row_data_set_parts[10];

    var simBaseName = configuration_basename;

    root  = simBaseName;
    root += "_" + aircraftName;
    root += "_" + l1Name;
    root += "_" + pylonName;
    root += "_" + separationName;
    root += "_" + gammaName;
    root += "_" + column_label_prefix + column_value;
    //root += "_" + aoaName;
    root += "_" + betaName;
    root += "_" + altitudeName;
    root += "_" + speedName;
    root += "_" + baseName;
    root += "_" + meshName;
    root += "/";
  } else if ( miniwall_type == "virgin_flutter" ) {
    // This is what was used for the Virgin Galactic project.
    if ( image_directory_path_default ) {
      image_directory_path="./images/";  // path to directory with the images.
    }
    //20160603_CG747_L1012f_P11cncm_Sep10.0_G20_AoA3_Beta0_Alt35_KTAS385_Base140.0_Mesh9.80@12000_Force_Coefficients_ForceCoefficients.png
    var aircraftName = row_data_set_parts[0];
    var l1Name = row_data_set_parts[1];
    var pylonName = row_data_set_parts[2];
    var betaName = row_data_set_parts[3];
    var altitudeName = row_data_set_parts[4];
    var speedName = row_data_set_parts[5];
    var baseName = row_data_set_parts[6];
    var meshName = row_data_set_parts[7];
    var coupledAndRestOfName = row_data_set_parts[8];

    var simBaseName = configuration_basename;

    root  = simBaseName;
    root += "_" + aircraftName;
    root += "_" + l1Name;
    root += "_" + pylonName;
    root += "_" + "Sep0";
    //root += "_" + gammaName;
    root += "_" + "G0";
    root += "_" + column_label_prefix + column_value;
    //root += "_" + aoaName;
    root += "_" + betaName;
    root += "_" + altitudeName;
    root += "_" + speedName;
    root += "_" + baseName;
    root += "_" + meshName;
    root += "/";
  } else if ( miniwall_type == "virgin_vms" ) {
    // This is what was used for the Virgin Galactic project.
    if ( image_directory_path_default ) {
      image_directory_path="./images/";  // path to directory with the images.
    }
    //20160603_CG747_L1012f_P11cncm_Sep10.0_G20_AoA3_Beta0_Alt35_KTAS385_Base140.0_Mesh9.80@12000_Force_Coefficients_ForceCoefficients.png
    var aircraftName = row_data_set_parts[0];
    var l1Name = row_data_set_parts[1];
    var pylonName = row_data_set_parts[2];
    var betaName = row_data_set_parts[3];
    var altitudeName = row_data_set_parts[4];
    var speedName = row_data_set_parts[5];
    var baseName = row_data_set_parts[6];
    var meshName = row_data_set_parts[7];
    var coupledAndRestOfName = row_data_set_parts[8];

    var simBaseName = configuration_basename;

    root  = simBaseName;
    root += "_" + aircraftName;
    root += "_" + l1Name;
    root += "_" + pylonName;
    root += "_" + "Sep0";
    //root += "_" + gammaName;
    root += "_" + "G-" + column_value;
    root += "_" + column_label_prefix + column_value;
    //root += "_" + aoaName;
    root += "_" + betaName;
    root += "_" + altitudeName;
    root += "_" + speedName;
    root += "_" + baseName;
    root += "_" + meshName;
    root += "/";
  } else if ( miniwall_type == "ERA" || miniwall_type === undefined ) {
    // This is what is used for the ERA project.
    // setup the base parts of the name from the row_data_sets array.
    var configName           = row_data_set_parts[0];
    var machName             = row_data_set_parts[1];
    var beta                 = row_data_set_parts[2];
    var meshAndFlowRatesName = row_data_set_parts[3];
    // For a few simulations, there is not a full set of data with the same run values so use ones close to the desired ones.
    var pat = /A-4.6.4:Mach0.2026:Beta0:Base1450_Mesh10.15_Poly/;
    if ( pat.test(row_data_set) && row_data_set == "0" ) {
      meshAndFlowRatesName = "Base1400_Mesh10.15_Poly";
    }
    pat = /A-4.6.5:Mach0.2026:Beta0:Base1500_Mesh10.15_Poly_wrongAALoc/;
    if ( pat.test(row_data_set) && row_data_set == "0" ) {
      meshAndFlowRatesName = "Base1500_Mesh10.15_Poly";
    }
    var root = configuration_basename + "_" + configName + "_" + machName + "_Alt0_" ;
    root+= column_label_prefix + column_value + "_" + beta + "_" + meshAndFlowRatesName + "_";
  }
  return root;
}

// Strip out leading, traling, and extra spaces.
function getFileString(name_list){
  return name_list.trim().replace('/\s+/g'," ");
}

// Called when an image is clicked in the main image table.
//  o) Shift-Alt-L_click Open a window with all of the images from the simulation from the image clicked.
//  o) Shift-L_click     Open a single image window
//  o) Ctrl-L_click      Previous image.
//  o) L_click           Next image.
function clickImageObject(event, image_id, table_element){
  // Get the element for the image clicked on.
  console.log('clickImageObject: id is ' + image_id);
  var element = document.getElementById(image_id);
  console.log('clickImageObject: element = ' + element + ' with id ' + image_id);
  if(!element){
    return;
  }

  // If left clicked on an image with the shiftKey depressed, show the current image in a new browser window.
  if(event.shiftKey){
    // If the altKey is depressed too, then open all of the images for the particular case in one window.
    // This is called the multi-image window.
    if(event.altKey || event.ctrlKey ){
      // For images 800 px tall, image_height+156 worked out to perfect page down and up motions.
      var open_string = 'width=' + (image_width+50) +', height=' + (image_height+156) + ', scrollbars=yes';
      var multi_image_window_name = image_id + " " + Date();
      var multi_image_window = window.open("about:blank", multi_image_window_name, open_string);
      multi_image_windows[multi_image_window_name] = multi_image_window;
      var doc = multi_image_window.document;
      var html='<h1>' + element.root.replace(/.*\//,"").replace(/_$/,"") + '</h1>';
      doc.open();
      doc.close();
      doc.body.imageBaseId = image_id;
      doc.body.root = element.root;
      doc.body.hideMissingImages = true;
      doc.body.scaleValueInPercent = initial_multi_image_window_images_scale_value_in_percent;
      var multi_image_window_images_width =  parseInt(image_width*initial_multi_image_window_images_scale_value_in_percent/100.0);
      var multi_image_window_images_height = parseInt(image_height*initial_multi_image_window_images_scale_value_in_percent/100.0);
      var header_element = doc.createElement("H2");
      header_element.innerHTML = element.root.replace(/.*\//,"").replace(/_$/,"");
      header_element.id = "heading_text";
      doc.body.appendChild(header_element);
      var useObjects = true;

      // Add all of the images for this simulation.
      for (var i=0;i<images.length;i++){
        var image_name = images[i];
        var image_src = element.src.replace(element.title,image_name);
        image_src=image_directory_path + element.root + image_name + image_filename_extension;
        if ( useObjects ) {
          var image_div = doc.createElement("DIV");
          var image_element = doc.createElement("IMG");
          image_element.id = image_id+'_' + i;
          image_element.title = image_name + " (" + i + ")";
          image_element.alt = image_name;
          image_element.src = image_src;
          image_element.image_index = i;
          image_element.root = element.root;
          image_element.width = multi_image_window_images_width;
          image_element.height = multi_image_window_images_height;
          image_element.style.backgroundColor = "red";
          image_element.style.color = "pink";
          image_element.className="multiImage";
          image_element.onclick = function(event) {clickImageObjectInMultiImageWindow(event, this, table_element, multi_image_window)};
          image_element.imageExists=true;
          // Hide the images that do not load.
          image_element.onerror=function(){this.style.display="none"; this.imageExists=false;};
          image_div.appendChild(image_element);
          image_div.style.display = "inline";
          image_div.id = "div_" + image_element.id;
          doc.body.appendChild(image_div);
        } else {
          // The object version above is much nicer than this original html version.
          html += '<img name="img'+ i + '" id="'+image_id+'_' + i + '" src="' + image_src +'" hspace=0';
          html += ' style="width:' + image_width + '; height: '+ image_height + '"';
          html += ' title='+image_name;
          html += ' alt_name='+image_name;
          html += ' >';
          html+='<br><b>Figure ' + (i+1) + ': ' + image_name + '</b><br><br>';
        }
      }
      if ( !useObjects ) { doc.body.innerHTML = html; }
      setMultiImageWindowTitle(doc);

      // Add an event listener to watch keyboard events and update the images.
      doc.addEventListener("keydown",
          function(event) {
            console.log(event);
            //console.log("showImageObject.addEventListener: keydown keyIdentifier = " + event.keyIdentifier);
            console.log("showImageObject.addEventListener: keydown key           = " + event.key);
            if(event.shiftKey){ console.log("showImageObject.addEventListener: Shift key is depressed.");}
            switch (event.keyCode) {
              case 65:  // A key.
                restoreOrHideMultiImageWindowMissingImages(doc);
                break;
              case 72:  // H key.
                helpWindow();
                break;
              case 38:  // Up arrow key.
              case 39:  // Right arrow key.
              case 74:  // J key.
                if(event.shiftKey){
                  console.log("showImageObject.addEventListener: Shift J key is depressed.");
                  resizeMultiImageWindow(doc, -image_resize_scale_delta);
                } else {
                  //nextSingleImageObject(image_element);
                }
                break;
              case 37:  // Left arrow key.
              case 40:  // Down arrow key.
              case 75:  // K key.
                if(event.shiftKey){
                  console.log("showImageObject.addEventListener: Shift K key is depressed.");
                  resizeMultiImageWindow(doc, image_resize_scale_delta);
                } else {
                  // If the single image windows are linked or all of the images are linked, then update the images to be the same.
                }
                break;
              case 76:  // L key.
                // For the "L" key, link together all of the images in the main window to those in the single image windows.
                if(event.shiftKey){
                  link_all_image_windows = link_all_image_windows?false:true;
                  if ( link_all_image_windows ) {
                    link_single_image_windows = true;
                    //setImageObjects(table_element, image_element.image_index);
                    //if (link_single_image_windows) { setSingleImageWindowsToSameImage(image_element.image_index); }
                    if (link_single_image_windows) { setSingleImageWindowsToSameImage(selected_image_index); }
                  }
                  // For the "l" key, link together all of the images in the single image windows.
                } else {
                  link_single_image_windows = link_single_image_windows?false:true;
                  if (link_single_image_windows) { setSingleImageWindowsToSameImage(selected_image_index); }
                  //if (link_single_image_windows) { setSingleImageWindowsToSameImage(image_element.image_index); }
                  //if (link_all_image_windows) { setImageObjects(table_element, image_element.image_index); }
                }
                break;
              case 80:  // P key.
                raiseAllSingleImageWindows();
                break;
              case 81:  // Q key.
                if(event.shiftKey){
                  closeAllSingleImageWindows();
                  closeAllMultiImageWindows();
                  closeAllHelpWindows();
                } else {
                  multi_image_window.close();
                }
                break;
            }
          }
      );

      // ===================== For Debugging: open the image window showing all of the images but without the doc.open & doc.close calls.
      // For images 800 px tall, image_height+156 worked out to perfect page down and up motions.
      if ( false ) {
        var wnd2 = window.open("about:blank", "", 'width=' + (image_width+50) +', height=' + (image_height+156) + ', scrollbars=yes');
        //var wnd = window.open("about:blank", "", 'width=' + (image_width+50) +', height=' + (image_height+156) + ', scrollbars=yes');
        var doc2 = wnd2.document;
        doc2.baseURI = document.baseURI;
        doc2.URL = document.URL;
        doc2.body.innerHTML = html;
        console.log('clickImageObject: body created using open and close calls:');
        console.log(doc);
        console.log('clickImageObject: body created without using open and close calls:');
        console.log(doc2);
      }
    } else {
      //  o) Shift-L_click     Open a single image window
      var element_clone = element.cloneNode(true);
      element_clone.root = element.root;
      element_clone.image_index = element.image_index;
      element_clone.id = "single_image";
      element_clone.scale_value_in_percent = 100;
      showImageObject(element_clone, table_element);
    }
  } else {
    // Show the next image if left clicked or the previous image if ctrl-left clicked.
    if(!element.image_index){
      element.image_index=selected_image_index;
    }
    var index = element.image_index;
    var next_image;
    var image_link;
    var index_num=new Number(element.image_index);
    // Change to the previous image if left clicked on an image with the ctrlKey depressed,
    if(event.ctrlKey){
      if(index_num==0){
        index_num=images.length-1;
      }
      else{
        index_num-=1;
      }
    } else{
      if(index_num==images.length-1){
        index_num=0;
      }
      else{
        index_num+=1;
      }
    }

    element.image_index=index_num.toString();
    next_image=images[index_num];
    element.title=next_image;  // Update text that shows when the file is not available.
    element.alt=next_image;    // Update text that shows for mouseover.

    image_link=image_directory_path + element.root + next_image + image_filename_extension;
    element.src=image_link;
  }
}

// If left clicked on an image in a multi-image window with the shiftKey depressed, show the current image in a new browser window.
function clickImageObjectInMultiImageWindow(event, image_element, table_element, multi_image_window){
  //  o) Shift-L_click     Open a single image window
  var doc = image_element.ownerDocument;
  console.log("# clickImageObjectInMultiImageWindow:: image_element.id is " + image_element.id);
  console.log(image_element);
  if(event.shiftKey){
    var element_clone = image_element.cloneNode(true);
    element_clone.root = image_element.root;
    element_clone.image_index = image_element.image_index;
    element_clone.id = "single_image";
    element_clone.scale_value_in_percent = 100;
    element_clone.height = image_height;
    element_clone.width = image_width;
    element_clone.style.width  = "";
    element_clone.style.height = "";
    showImageObject(element_clone, table_element);
  } else {
    console.log("# clickImageObjectInMultiImageWindow: Image index is: " + image_element.image_index);
    if ( link_single_image_windows || link_all_image_windows) { 
      setSingleImageWindowsToSameImage(image_element.image_index); 
    }
    if ( (! link_single_image_windows) || link_all_image_windows) { 
      setImageObjects(table_element, image_element.image_index);
    }
  }
}

// Create a new window with the image from the main image table.
function showImageObject(image_element, table_element) {
  var winHeight = image_height;
  var winWidth  = image_width;
  image_element.height = image_height;
  image_element.width = image_width;

  // default behavior: create new window

  // Set the size to be the same as the other single image windows if the sizes are linked together.
  if (link_single_image_windows_resize_events) {
    winHeight = image_height*last_link_single_image_windows_resize_events_size/100.0;
    winWidth  = image_width*last_link_single_image_windows_resize_events_size/100.0;
  }
  var open_string = "resizable,scrollbars,height=" + winHeight + ",width=" + winWidth;
  var image_window_name = "image " + Date();
  var image_window = window.open("about:blank", image_window_name, open_string);
  image_windows[image_window_name] = image_window;
  image_windows_image[image_window_name] = image_element;
  var doc = image_window.document;
  doc.open();
  doc.close();
  doc.body.appendChild(image_element);
  setImageWindowTitle(image_element);  // Set the window title.
  doc.body.style.margin = 0;  // Remove the 8px margin from the main page
  image_window.focus();
  image_element.onclick = function(event) {clickSingleImageObject(event, this, table_element)};
  // To make sure the single image window is drawn to the correct size, wait a bit and then set the
  // onresize function and resize it.
  setTimeout(function(){
    console.log("Resize window called with 250 ms timeout for window " + image_window + " and image_element " + image_element);
    console.log("    image_element with id=" + image_element.id + ", width=" + image_element.width + ", height=" + image_element.height);
    image_window.onresize = function() {resize_image_element_to_fit_window(image_window, image_element, true)};
    resize_image_element_to_fit_window(image_window, image_element, false);
  },250);  // 150 ms should be plenty.  Use 250 ms to be sure.

  // Add an event listener to watch keyboard events and change the image if they are found.
  image_window.document.addEventListener("keydown",
      function(event) {
        console.log(event);
        console.log("showImageObject.addEventListener: keydown key = " + event.key);
        //console.log("showImageObject.addEventListener: keydown = " + event.keyIdentifier);
        console.log("showImageObject.addEventListener: keydown keyCode = " + event.keyCode);
        console.log("showImageObject.addEventListener: keydown which = " + event.which);
        if(event.shiftKey){ console.log("showImageObject.addEventListener: Shift key is depressed.");}
        switch (event.keyCode) {
          case 72:  // H key.
            helpWindow();
            break;
          case 38:  // Up arrow key.
          case 39:  // Right arrow key.
          case 74:  // J key.
            if(event.shiftKey){
              console.log("showImageObject.addEventListener: Shift J key is depressed.");
              resizeSingleImageWindow(image_element, -image_resize_scale_delta);
            } else {
              nextSingleImageObject(image_element);
              // If the single image windows are linked or all of the images are linked, then update the images to be the same.
              if (link_single_image_windows) { setSingleImageWindowsToSameImage(image_element.image_index); }
              if (link_all_image_windows) { setImageObjects(table_element, image_element.image_index); }
            }
            break;
          case 37:  // Left arrow key.
          case 40:  // Down arrow key.
          case 75:  // K key.
            if(event.shiftKey){
              console.log("showImageObject.addEventListener: Shift K key is depressed.");
              resizeSingleImageWindow(image_element,  image_resize_scale_delta);
            } else {
              previousSingleImageObject(image_element);
              // If the single image windows are linked or all of the images are linked, then update the images to be the same.
              if (link_single_image_windows) { setSingleImageWindowsToSameImage(image_element.image_index); }
              if (link_all_image_windows) { setImageObjects(table_element, image_element.image_index); }
            }
            break;
          case 76:  // L key.
            // For the "L" key, link together all of the images in the main window to those in the single image windows.
            if(event.shiftKey){
              link_all_image_windows = link_all_image_windows?false:true;
              if ( link_all_image_windows ) {
                link_single_image_windows = true;
                setImageObjects(table_element, image_element.image_index);
                if (link_single_image_windows) { setSingleImageWindowsToSameImage(image_element.image_index); }
              }
            // For the "l" key, link together all of the images in the single image windows.
            } else {
              link_single_image_windows = link_single_image_windows?false:true;
              if (link_single_image_windows) { setSingleImageWindowsToSameImage(image_element.image_index); }
              if (link_all_image_windows) { setImageObjects(table_element, image_element.image_index); }
            }
            break;
          case 80:  // P key.
            raiseAllSingleImageWindows();
            break;
          case 81:  // Q key.
            if(event.shiftKey){
              closeAllSingleImageWindows();
              closeAllMultiImageWindows();
              closeAllHelpWindows();
            } else {
              image_window.close();
            }
            break;
          case 82:  // R key.
            if(event.shiftKey){
              link_single_image_windows_resize_events = link_single_image_windows_resize_events?false:true;
              if (link_single_image_windows_resize_events) { resizeAllSingleImageWindows(image_element.scale_value_in_percent); }
            } else {
              // Resize the single image window to 100% of the image size. 
              resizeSingleImageWindow(image_element, 100-image_element.scale_value_in_percent);
            }
            break;
          case 87:  // W key.
            setSingleImageWindowsToSameImage(image_element.image_index);
            break;
        }
      }
  );
}

// Set the image size to fill a resized window as fully as possible and resize the window
// to fit this image.  This allows the single image window to be resized and have it exactly fit the image.
// Only resize the other single image windows if the resize_all_windows parameter is true and the resize
// events are linked together.
// Skip resizing anything if the window for the image does not have the focus.  If the window is being
// resized by the mouse, it will have the focus.  If it has been resized by another linked window, it will not
// have the focus and should not be resized again.  Adding this focus check is what fixed an annoying bug
// where occasionally a window would be resized with the mouse and the linked windows would get out of sync and
// call resize events on eachother.  The windows would resize and flash about sometimes for several minutes.
function resize_image_element_to_fit_window(image_window, image_element, resize_all_windows){
  if ( !image_window.document.hasFocus() ) { 
    console.log("resize_image_element_to_fit_window:: Window does not have focus so not resizing: " + image_element.root);
    return; 
  };
  console.log("resize_image_element_to_fit_window:: image_window: " + image_window);
  console.log("resize_image_element_to_fit_window:: image_element: " + image_element);
  console.log("resize_image_element_to_fit_window:: resize_all_windows: " + resize_all_windows);
  if (image_window.innerWidth === undefined ) return;
  if (image_window.innerHeight === undefined) return;
  var width_percent = 100*image_window.innerWidth/image_width;
  var height_percent = 100*image_window.innerHeight/image_height;
  console.log("resize_image_element_to_fit_window:: Window resized to " + image_window.innerWidth + "x" + image_window.innerHeight + " this is " + width_percent + "%x" + height_percent + "%");
    console.log("    image_element with id=" + image_element.id + ", width=" + image_element.width + ", height=" + image_element.height);
  var image_aspect_ratio = image_width/image_height;
  var screen_aspect_ratio = image_window.innerWidth/image_window.innerHeight;
  console.log("     image_aspect_ratio = " + image_aspect_ratio);
  console.log("     screen_aspect_ratio = " + screen_aspect_ratio);

  // Use the screen and image aspect ratios to decide whether to change
  // the image size to fit the width or height of the window.
  if ( screen_aspect_ratio > image_aspect_ratio ) {
    image_element.width  = image_window.innerHeight*image_aspect_ratio;
    image_element.height = image_window.innerHeight;
  } else {
    image_element.width  = image_window.innerWidth;
    image_element.height = image_window.innerWidth/image_aspect_ratio;
  }
  console.log("    image_element.width = " + image_element.width );
  console.log("    image_element.height = " + image_element.height );
  //image_element.scale_value_in_percent = parseInt(100*image_element.width/image_width);
  image_element.scale_value_in_percent = 100*image_element.width/image_width;
  console.log("    image_element.scale_value_in_percent = " + image_element.scale_value_in_percent );
  // Resize the image_window to fit the image_element in both width and height.
  resizeSingleImageWindow(image_element, 0);
  
  if (resize_all_windows && link_single_image_windows_resize_events) { 
    console.log("resize_image_element_to_fit_window::  Calling resize function on all single image windows.");
    resizeAllSingleImageWindows(image_element.scale_value_in_percent);
  }
}


// Called when an image in a single image window is left-clicked.
//  o) Ctrl-L_click      Previous image.
//  o) L_click           Next image.
function clickSingleImageObject(event, image_element, table_element) {
  console.log("clickSingleImageObject:: working on element " + image_element.id);
  console.log("clickSingleImageObject:: working on element " + image_element.src);
  console.log("clickSingleImageObject:: working on element " + image_element.root);
  console.log(image_element);
  // Get the element for the image clicked on.
  var element = image_element;
  console.log('clickSingleImageObject: element = ' + image_element);
  if(!image_element){
    return;
  }
  console.log('clickSingleImageObject: element = ' + image_element + ' with id ' + image_element.id);
  console.log('clickSingleImageObject: event = ' + event);
  console.log('clickSingleImageObject: event = ' + event + ' event.shiftKey ' + event.shiftKey);

  // If left clicked on an image with the shiftKey depressed, show the current image in a new browser window.
  if(event.ctrlKey){
    previousSingleImageObject(image_element);
  } else { // Show the next image if left clicked or the previous image if ctrl-left clicked.
    nextSingleImageObject(image_element);
  }
  if (link_single_image_windows) { setSingleImageWindowsToSameImage(image_element.image_index); }
  if (link_all_image_windows) { setImageObjects(table_element, image_element.image_index); }
}

function previousImageObject(table_element) {
  setImageObjects(table_element, selected_image_index-1);
}

function nextImageObject(table_element) {
  setImageObjects(table_element, selected_image_index+1);
}

function nextSingleImageObject(image_element) {
  var next_image_index = Number(image_element.image_index)+1;
  if(next_image_index > images.length-1){
    next_image_index = 0;
  }
  setImageObject(image_element, next_image_index);
  setImageWindowTitle(image_element);
  if ( image_element.ownerDocument.hasFocus() ) {
    image_element.onerror=function(){
      console.log('Next image not found: ' + image_element.src);
      if (false && link_single_image_windows) {  // I tried to get all of the images to stay in sync but gave up.
        var next_image_index = Number(image_element.image_index)+1;
        if(next_image_index > images.length-1){
          next_image_index = 0;
        }
        setSingleImageWindowsToSameImage(selected_image_index); 
      }
      nextSingleImageObject(image_element);
    };
  } else {
    image_element.onerror="";
    console.log("nextSingleImageObject:: Window does not have focus so not resizing: " + image_element.root + ' so not setting onerror function ');
  }
}

function previousSingleImageObject(image_element) {
  var previous_image_index = Number(image_element.image_index)-1;
  if(previous_image_index < 0){
    previous_image_index = images.length-1;
  }
  setImageObject(image_element, previous_image_index);
  setImageWindowTitle(image_element);
  if ( image_element.ownerDocument.hasFocus() ) { 
    image_element.onerror=function(){console.log('Previous image not found: ' + image_element.src); previousSingleImageObject(image_element) };
  } else {
    image_element.onerror="";
    console.log("nextSingleImageObject:: Window does not have focus so not resizing: " + image_element.root + ' so not setting onerror function ');
  }
}

// Set all of the images in a table to the given index.
function setImageObjects(table_element, image_index) {
  if ( image_index < 0 ) {
    selected_image_index = images.length - 1;
  } else if ( image_index >= images.length ) {
    selected_image_index = 0;
  } else {
    selected_image_index = image_index;
  }
  // Update the image selection dropdown to show the selected image name.
  var image_select = document.getElementById(image_select_id);
  image_select.selectedIndex = selected_image_index;
  // Update the image table to show the image with the image_index.
  selected_image = images[selected_image_index];
  console.log("setImageObjects: image_index = " + image_index + " selected_image_index = " + selected_image_index);
  var class_list = table_element.getElementsByClassName("Image");
  for ( var i = 0; i < class_list.length; i++) {
    var image_element = class_list[i];
    setImageObject(image_element, selected_image_index);
  }
  // If all of the images are linked, then update the images to be the same.
  if (link_all_image_windows) {
    setSingleImageWindowsToSameImage(selected_image_index);
  }
}

// Set the image to the specified image number.
function setImageObject(image_element, image_index){
    var selected_image = images[image_index];
    var td_display = image_element.parentNode.parentNode.style.display;
    console.log("setImageObject: setting image to number " + image_index + " with name " + selected_image + " for = " + image_element.id + " display " + td_display );
    if ( td_display != "none" ) {
      var strImage = image_element.root + selected_image + image_filename_extension;
      //strImage="./images/"+strImage;
      strImage= image_directory_path+strImage;
      image_element.src = strImage;
      image_element.title = selected_image;
      image_element.alt = selected_image;
      image_element.image_index = image_index;
      //image_element.onerror=imageNotFound;
    }
}

function imageNotFound() {
  alert('That image not found');
}

// Set the single image window name to be the image name with the image index and the image scale in percent.
function setImageWindowTitle(image_element){
  var title = image_element.root + image_element.title;
  title += " (#" + image_element.image_index + " - " + image_element.scale_value_in_percent + "%)";
  image_element.ownerDocument.title = title;
}

// Set the multi-image window name to be the sim name with the image scale in percent.
function setMultiImageWindowTitle(doc){
  var title = doc.body.root.replace(/_$/,"") + " - " + doc.body.scaleValueInPercent + "%";
  doc.title = title;
  doc.getElementById("heading_text").innerHTML = title;
}

// Reset the main image table images to have the initial size.
function resetImageSize(table_element){
  setImageSize(table_element, initial_size_in_percent);
}

// Resize all of the images in the table to the given size in percent.
function setImageSize(table_element, size_in_percent) {
  console.log("setImageSize: size_in_percent = " + size_in_percent);
  setSizeSliderText(size_in_percent);
  var class_list = table_element.getElementsByClassName("Image");
  var width = image_width*size_in_percent/100.0;
  var height =image_height*size_in_percent/100.0;
  for ( var i = 0; i < class_list.length; i++) {
    var image_element = class_list[i];
    image_element.width = width;
    image_element.height = height;
  }
}

// Transpose a table of elements.
function transposeTableOfObjects(table_element){
  var alt_name="";
  var content="";
  var table_id = table_element.id;

  if ( !table_element ) {
    console.log("transposeTableOfObjects: Could not find table to be transposed with id '" + table_id + "'.");
    return;
  } else {
    console.log("# table to be transposed is '" + table_id + "'.  Object for this table is: " + table_element);
  }
  var maxColumns = 0;
  // Find the max number of columns
  var num_rows = table_element.rows.length;
  var num_columns = table_element.rows[0].cells.length;
  console.log("# Number of rows in the table is: " + num_rows );
  console.log("# Number of columns in the table is: " + num_columns );

  var array_of_cells = [];
  for (var r = 0; r < num_rows; r++) {
    array_of_cells[r] = [];
    var row = table_element.rows[r];
    var num_cells = table_element.rows[r].cells.length;
    console.log("# transposeTableOfObjects: r = " + r + " row_name = " + row.id + ' with ' + num_cells + ' cells');

    for ( var c = 0; c < num_columns; c++) {
      array_of_cells[r][c] = row.cells[c];
      var cell = row.cells[c];
      if ( !cell ) { return };
      console.log("# transposeTableOfObjects: r = " + r + " c = " + c + " table_data_id = " + cell.id);
    }
  }

  // Remove the empty rows from the table.
  var r = 0;
  while ( table_element.rows.length ) {
    table_element.deleteRow(0);
    console.log("# transposeTableOfObjects: Deleted a row");
  }

  for ( var c = 0; c < num_columns; c++) {
    var table_row = document.createElement("TR");
    table_row.id="table_row_" + c;
    table_element.appendChild(table_row);
    //table_element.appendChild(table_row);
    for (var r = 0; r < num_rows; r++) {
      table_row.appendChild(array_of_cells[r][c]);
    }
  }

  // Update the styles for the row and column titles and unhide boxes.
  if ( object_table_transposed ) {
    // The table was transposed and now it is not transposed.
    object_table_transposed = 0
    // Set the alignment of the table headings for the table in the original (not-transposed) state.
    getCssRuleStyle(document, ".titleRowLeft").textAlign  = "right";
    getCssRuleStyle(document, ".titleRowRight").textAlign = "left";
    //getCssRuleStyle(document, ".titleRowLeft").fontSize = "15";
    // Move the unhide boxes.
    var top_right_style = getCssRuleStyle(document, ".topRight");
    //console.log(top_right_style);
    top_right_style.top = "0px";
    top_right_style.right = "0px";
    top_right_style.bottom = "";
    top_right_style.left = "";
    var bottom_left_style = getCssRuleStyle(document, ".bottomLeft");
    //console.log(bottom_left_style);
    bottom_left_style.top = "";
    bottom_left_style.right = "";
    bottom_left_style.bottom = "0px";
    bottom_left_style.left = "0px";
    bottom_left_style.backgroundColor = "orange";
  } else {
    // The table was not transposed and now it is transposed.
    object_table_transposed = 1
    // Set the alignment of the table headings for the table in the transposed state.
    getCssRuleStyle(document, ".titleRowLeft").textAlign = "center";
    getCssRuleStyle(document, ".titleRowRight").textAlign = "center";
    // Move the unhide boxes.
    var top_right_style = getCssRuleStyle(document, ".topRight");
    //console.log(top_right_style);
    top_right_style.top = "";
    top_right_style.right = "";
    top_right_style.bottom = "0px";
    top_right_style.left = "0px";
    var bottom_left_style = getCssRuleStyle(document, ".bottomLeft");
    //console.log(bottom_left_style);
    bottom_left_style.top = "0px";
    bottom_left_style.right = "0px";
    bottom_left_style.bottom = "";
    bottom_left_style.left = "";
    bottom_left_style.backgroundColor = "blue";
  }

  console.log("# transposeTableOfObjects: Done.");
  return;
}

// Create the main image table page.
function createObjectTablePage() {
  if ( initial_size_in_percent === undefined ) {
    initial_size_in_percent = 0;
  };
  size_in_percent = initial_size_in_percent;
  if ( initial_selected_configuration_index === undefined ) {
    initial_selected_configuration_index = 0;
  };
  selected_configuration_index = initial_selected_configuration_index;
  if ( initial_selected_mach_number_index === undefined ) {
    initial_selected_mach_number_index = 0;
  };
  selected_mach_number_index = initial_selected_mach_number_index;

  images = getFileString(image_extension_names).split(" ");
  if ( initial_image_index === undefined ) {
    initial_image_index = 0;
  };
  if ( image_directory_path === undefined ) {
    // path relative the the main html page to directory with the images.
    image_directory_path="./images/";  
    image_directory_path_default = true;
  } else {
    image_directory_path=image_directory_path + "/";  
  }
  selected_image_index = initial_image_index;
  selected_image=images[selected_image_index];
  image_filename_extension = "." + image_filename_extension;
  console.log("createObjectTablePage: Opening a new page and drawing a table from objects with a size_in_percent of " + size_in_percent + ".");
  console.log("createObjectTablePage: image width is " + image_width + ".");
  console.log("createObjectTablePage: image height is " + image_height + ".");
  //document.open(); // Use doc.open and doc.close to initialize the document.
  //document.close();
  if ( miniwall_page_tab_name === undefined ) {
    document.title = "MiniWall";
  } else {
    document.title = miniwall_page_tab_name;
  }


  // Set up the main window document
  document.body.style.margin = 0;  // Remove the 8px margin from the main page


  // Create the style sheet rules for placing the unhide boxes on the image table.
  createStyleSheetRules();

  // Create a div for the image table.
  var image_table_div_element = document.createElement("div");
  image_table_div_element.id = 'main_image_table_div';
  image_table_div_element.style.fontSize = '30px';
  image_table_div_element.style.height = window.innerHeight-50 + 'px';
  // reset the height when the window is resized.
  document.body.onresize = function() {image_table_div_element.style.height = window.innerHeight-50 + 'px';};
  image_table_div_element.style.overflow = 'auto';  // Add a scrollbar.
  image_table_div_element.style.backgroundColor = 'pink';
  image_table_div_element.style.backgroundColor = 'green';
  document.body.appendChild(image_table_div_element);
  var table_element = create_image_table_object(size_in_percent);  // create the image table object.
  console.log("createObjectTablePage: Before appending table to the 'div' element '" + table_element + "'");
  image_table_div_element.appendChild(table_element);
  console.log("createObjectTablePage: After appending table to the 'div' element '" + table_element + "'");

  console.log("createObjectTablePage: Before CSS changes.");
  table_element.style.fontSize = '13px';
  table_element.style.bgcolor = '#0000ff';
  table_element.style.bgcolor = 'red';
  table_element.style.fgcolor = 'white';
  table_element.style.border = '2px solid yellow';
  table_element.style.borderTopWidth = '2px';
  table_element.style.borderTopColor = 'red';
  table_element.style.borderBottomColor = 'red';
  table_element.style.border = '2px solid green';
  console.log("createObjectTablePage: After CSS changes.");

  // Add the control buttons to the bottom of the page.
  console.log("createObjectTablePage: Adding buttons at the bottom of the image table.");
  var button_div_element = document.createElement("div");
  //button_div_element.innerHTML = '<h1>Image Page created by using HTML and Table objects</h1>';
  button_div_element.id = 'button_table_div';
  button_div_element.style.fontSize = '16px';
  button_div_element.style.position = 'fixed';
  button_div_element.style.height = '50px';
  button_div_element.style.bottom = '0';
  button_div_element.style.width = '100%';
  button_div_element.style.overflow = 'auto';
  button_div_element.style.backgroundColor = 'OldLace';
  document.body.appendChild(button_div_element);

  // Add a transpose button
  var transpose_button = document.createElement("INPUT");
  transpose_button.type = 'button';
  transpose_button.value = 'Transpose';
  transpose_button.title = '(t) Transpose';
  transpose_button.onclick = function() { transposeTableOfObjects(table_element)};
  //transpose_button.onclick = "transposeTableOfObjects(table_element)";
  button_div_element.appendChild(transpose_button);

  // Scale slider
  var scale_button_div = document.createElement("div");
  scale_button_div.classList.add("selectorDiv");
  var scale_button = document.createElement("INPUT");
  scale_button.type = 'range';
  scale_button.title = "Set the Image Size: (J) for smaller and (K) for bigger";
  scale_button.value = size_in_percent;
  scale_button.min = 1;
  scale_button.max = 200;
  scale_button.border = "2px solid purple";
  scale_button.id = scale_slider_id;
  scale_button.style.width = '200px';
  scale_button.onchange = function(){sizeSliderChange(this, table_element)}; // Update only when the mouse is released.
  scale_button.oninput  = function(){sizeSliderChange(this, table_element)}; // Update on slider motion.
  scale_button.style.border = '2px solid red';  // The border color style does not work.
  // Create a div to put the Images size above the scale slider button.
  var scale_button_div_text = document.createElement("div");
  scale_button_div_text.id = scale_slider_div_id;
  scale_button_div_text.innerHTML = "Image Size " + scale_button.value + "%<br>";
  // Put all of the div's together.
  scale_button_div.appendChild(scale_button_div_text);
  scale_button_div.appendChild(scale_button);
  button_div_element.appendChild(scale_button_div);

  // Image selector input element
  var image_select_div = document.createElement("DIV");
  image_select_div.classList.add("selectorDiv");
  image_select_div.innerHTML = "Image Selection<br>";
  var image_select = document.createElement("SELECT");
  image_select.id = image_select_id;
  image_select.classList.add("selectorStyle");
  image_select.style.width = '600px';
  for ( var i = 0; i<images.length; i++) {
    var option = document.createElement("option");
    option.text = images[i];
    image_select.add(option);
  }
  image_select.onchange = function(){imageSelectChange(this, table_element)};
  image_select.selectedIndex = selected_image_index;
  //image_select.style.border = '2px solid red';  // The border color style does not work.
  image_select_div.appendChild(image_select);
  button_div_element.appendChild(image_select_div);

  if ( configurations !== undefined && configurations.length > 0 ) {
    has_configurations = true;
    var configuration_div = document.createElement("DIV");
    configuration_div.classList.add("selectorDiv");
    var configuration_select = document.createElement("SELECT");
    configuration_select.id = configuration_select_id;
    configuration_select.classList.add("selectorStyle");
    configuration_select.style.width = '220px';
    for ( var i = 0; i<configurations.length; i++) {
      var option = document.createElement("option");
      option.text = configurations[i];
      configuration_select.add(option);
    }
    configuration_select.selectedIndex = selected_configuration_index;
    configuration_select.onchange = function(){configurationSelectChange(this, table_element)};
    configuration_div.innerHTML = "Configuration<br>";
    configuration_div.appendChild(configuration_select);
    button_div_element.appendChild(configuration_div);
  }

  // Mach Number selector input element
  if ( mach_numbers !== undefined && mach_numbers.length > 0 ) {
    has_mach_numbers = true;
    var mach_number_div = document.createElement("DIV");
    mach_number_div.classList.add("selectorDiv");
    var mach_number_select = document.createElement("SELECT");
    mach_number_select.id = mach_number_select_id;
    mach_number_select.classList.add("selectorStyle");
    mach_number_select.style.width = '120px';
    for ( var i = 0; i<mach_numbers.length; i++) {
      var option = document.createElement("option");
      option.text = mach_numbers[i];
      mach_number_select.add(option);
    }
    mach_number_select.selectedIndex = selected_mach_number_index;
    mach_number_select.onchange = function(){machNumberSelectChange(this, table_element)};
    mach_number_div.innerHTML = "Mach Number<br>";
    mach_number_div.appendChild(mach_number_select);
    button_div_element.appendChild(mach_number_div);
  }

  // Add previous and next buttons
  var previous_button = document.createElement("INPUT");
  previous_button.type = 'button';
  previous_button.value = 'Previous';
  previous_button.title = '(k) Previous';
  previous_button.onclick = function() { previousImageObject(table_element) };
  button_div_element.appendChild(previous_button);
  var next_button = document.createElement("INPUT");
  next_button.type = 'button';
  next_button.value = 'Next';
  next_button.title = '(j) Next';
  next_button.onclick = function() { nextImageObject(table_element) };
  button_div_element.appendChild(next_button);

  // Add a reset button
  var reset_button = document.createElement("INPUT");
  reset_button.type = 'button';
  reset_button.value = 'Reset';
  reset_button.title = '(r) Reset to original image size';
  reset_button.onclick = function() { resetImageSize(table_element)};
  button_div_element.appendChild(reset_button);

  // Add a help button
  var help_button = document.createElement("INPUT");
  help_button.type = 'button';
  help_button.value = 'Help';
  help_button.title = '(h) Help';
  help_button.onclick = function() { helpWindow()};
  button_div_element.appendChild(help_button);

  var button_table_element =  document.createElement("TABLE");
  console.log("createObjectTablePage: Before appending table to the 'button_div' element '" + button_table_element + "'");
  image_table_div_element.appendChild(button_table_element);

  // Add an event listener to watch keyboard events and change the image if they are found.
  document.addEventListener("keydown",
      function(event) {
        console.log(event);
        console.log(event.key);
        //console.log("createObjectTablePage.addEventListener: keydown = " + event.keyIdentifier);
        console.log("createObjectTablePage.addEventListener: keydown key = " + event.key);
        console.log("createObjectTablePage.addEventListener: keydown keyCode = " + event.keyCode);
        if(event.shiftKey){ console.log("createObjectTablePage.addEventListener: Shift key is depressed.");}
        switch (event.keyCode) {
          case 72:  // H key.
            helpWindow();
            break;
          case 38:  // Up arrow key.
          case 39:  // Right arrow key.
          case 74:  // J key.
            if(event.shiftKey){
              console.log("createObjectTablePage.addEventListener: Shift J key is depressed.");
              image_enlarge(table_element, -image_resize_scale_delta);
            } else {
              nextImageObject(table_element);
            }
            break;
          case 37:  // Left arrow key.
          case 40:  // Down arrow key.
          case 75:  // K key.
            if(event.shiftKey){
              console.log("createObjectTablePage.addEventListener: Shift K key is depressed.");
              image_enlarge(table_element, +image_resize_scale_delta);
            } else {
              previousImageObject(table_element);
            }
            break;
          case 76:  // L key.
            if(event.shiftKey){
              // For the "L" key, link together all of the images in the main window to those in the single image windows.
              link_all_image_windows = link_all_image_windows?false:true;
              if ( link_all_image_windows ) {
                link_single_image_windows = true;
                setSingleImageWindowsToSameImage(selected_image_index);
              }
            } else {
              // For the "l" key, link together all of the images in the single image windows.
              link_single_image_windows = link_single_image_windows?false:true;
              if (link_single_image_windows) {setSingleImageWindowsToSameImage(selected_image_index); }
            }
            break;
          case 80:  // P key.
            raiseAllSingleImageWindows();
            break;
          case 81:  // Q key.
            if(event.shiftKey){
              closeAllSingleImageWindows();
              closeAllMultiImageWindows();
              closeAllHelpWindows();
            }
            break;
          case 82:  // R key.
            resetImageSize(table_element);
            break;
          case 84:  // T key.
            transposeTableOfObjects(table_element);
            break;
          case 85:  // U key.
            unhideAllRowsAndColumns(table_element);
            break;
        }
      }
  );

  // Output the style sheets to the console.
  logSytleSheetRules(document);

  // Recreate the table to catch all of the changes that were made after it was created.
  create_image_table_object(size_in_percent);

  // If the initial_object_table_transposed value is set to 1, then transpose the table for the initial view.
  if ( ! (initial_object_table_transposed === undefined ) ) {
     if ( initial_object_table_transposed ) transposeTableOfObjects(table_element);
  };
}

// Called when the user selects a configuration from a drop down box that is below the main image table.
function configurationSelectChange(configuration_select_element, table_element){
  selected_configuration_index = configuration_select_element.selectedIndex;
  table_element = create_image_table_object(size_in_percent);
}

// Called when the user selects a Mach Number from a drop down box that is below the main image table.
function machNumberSelectChange(mach_number_select_element, table_element){
  selected_mach_number_index = mach_number_select_element.selectedIndex;
  table_element = create_image_table_object(size_in_percent);
}

// Called when the user selects an image from a drop down box that is below the main image table.
function imageSelectChange(image_select_element, table_element){
  selected_image_index = image_select_element.selectedIndex;
  setImageObjects(table_element, selected_image_index);
}

// Called when the user changes the image size slider below the main image table.
function sizeSliderChange(slider_element, table_element){
  var size_in_percent = slider_element.value;
  setImageSize(table_element, size_in_percent);
}

// Update the text in the image size slider to have the current size in percent.
function setSizeSliderText(size_in_percent){
  var scale_slider = document.getElementById(scale_slider_id);
  var scale_button_div_text = document.getElementById(scale_slider_div_id);
  scale_button_div_text.innerHTML = "Image Size " + size_in_percent + "%<br>";
  scale_slider.value = size_in_percent;
}

// Increase the size of the images in the main image table by the given value.
function image_enlarge(table_element, size_delta_in_percent){
  var scale_slider = document.getElementById(scale_slider_id);
  var scale_value_in_percent = Number(scale_slider.value);
  var new_scale_size = scale_value_in_percent + size_delta_in_percent;
  //scale_slider.value = new_scale_size;
  setImageSize(table_element, new_scale_size);
  console.log("image_enlarge: size_delta_in_percent is " + size_delta_in_percent + " new_scale_size is " + new_scale_size);
}

// Resize the image window so that it fits the image_element after adjusting
// the image size by the given image_resize_scale_delta.  Set the image_resize_scale_delta
// to zero to have the image window resized to fit the image_element.
function resizeSingleImageWindow(image_element, image_resize_scale_delta){
  console.log("# resizeSingleImageWindow::                                                 image_element.scale_value_in_percent = " + image_element.scale_value_in_percent + " image_resize_scale_delta = " + image_resize_scale_delta);
  var image_window = image_element.ownerDocument.defaultView;
  var size_in_percent = image_element.scale_value_in_percent + image_resize_scale_delta;
  console.log("# resizeSingleImageWindow:: size_in_percent= " + size_in_percent + " (This is the new image_element size in percent)");
  var new_width =  parseInt(image_width*size_in_percent/100.0);
  var new_height = parseInt(image_height*size_in_percent/100.0);
  console.log("# resizeSingleImageWindow:: new_width = " + new_width);
  console.log("# resizeSingleImageWindow:: new_height = " + new_height);
  var delta_width  = new_width  - image_window.innerWidth;
  var delta_height = new_height - image_window.innerHeight;
  console.log("# resizeSingleImageWindow:: delta_width = " + delta_width);
  console.log("# resizeSingleImageWindow:: delta_height = " + delta_height);
  image_element.width  = new_width;
  image_element.height = new_height;
  image_element.scale_value_in_percent = size_in_percent;
  // Resize the window containing the image.
  console.log("# resizeSingleImageWindow:: calling image_window.resizeBy(delta_width, delta_height) with delta_width = " + delta_width);
  console.log("# resizeSingleImageWindow:: calling image_window.resizeBy(delta_width, delta_height) with delta_height = " + delta_height);
  console.log("# resizeSingleImageWindow:: before image_window.resize call the width and height are " + image_window.innerWidth + "x" + image_window.innerHeight +
    " which is " + image_window.innerWidth*100.0/image_width + "%x" + image_window.innerHeight*100.0/image_height + "%");
  image_window.resizeBy(delta_width, delta_height);
  console.log("# resizeSingleImageWindow:: after image_window.resize call the width and height are " + image_window.innerWidth + "x" + image_window.innerHeight +
    " which is " + image_window.innerWidth*100.0/image_width + "%x" + image_window.innerHeight*100.0/image_height + "%");
  console.log("# resizeSingleImageWindow:: Setting window title.");
  setImageWindowTitle(image_element);
}

// Resize the image images in a multi-image window by the given amount.
function resizeMultiImageWindow(doc, image_resize_scale_delta){
  console.log("# resizeMultiImageWindow:: doc.scale_value_in_percent = " + doc.scaleValueInPercent + " image_resize_scale_delta = " + image_resize_scale_delta);
  //var multi_image_window = doc.ownerDocument.defaultView;
  var size_in_percent = doc.body.scaleValueInPercent + image_resize_scale_delta;
  size_in_percent = (size_in_percent>0)? size_in_percent:1;
  var new_width =  parseInt(image_width*size_in_percent/100.0);
  var new_height = parseInt(image_height*size_in_percent/100.0);
  // Add all of the images for this simulation.
  for (var i=0;i<images.length;i++){
    var image_name = images[i];
    var image_id = doc.body.imageBaseId +'_' + i;
    var image_element = doc.getElementById(image_id);
    image_element.style.width  = new_width + "px";
    image_element.style.height = new_height + "px";
  }
  doc.body.scaleValueInPercent = size_in_percent;
  setMultiImageWindowTitle(doc);
}


// Restore or hide all of the missing images for this multi-image window.
function restoreOrHideMultiImageWindowMissingImages(doc){
  console.log("# restoreMultiImageWindowHiddentImages:: Restoring hidden images in = " + doc);
  // Toggle the flag that tells whether or not the missing images should be hidden or not.
  doc.body.hideMissingImages = (doc.body.hideMissingImages)? false:true;
  for (var i=0;i<images.length;i++){
    var image_name = images[i];
    var image_id = doc.body.imageBaseId +'_' + i;
    var image_element = doc.getElementById(image_id);
    if ( !image_element.imageExists ) {
      image_element.style.display = (doc.body.hideMissingImages)? "none":"";
    }
  }
}

var help_window_count = 0;
function helpWindow() {
  console.log("helpWindow: Opening a help window");
  var html = ""
  html += '<head><style>td.key {color:green;text-align:right;vertical-align:top;}\n';
  html += '             td.description {color:red;padding-left:10px;}\n';
  html += '             </style></head>';
  html += '<h1 style="text-align:center;color:red">MiniWall Help</h1>\n';
  html += '<center><p>Brief list of keys for controling the MiniWall behavior</p></center>\n';
  html += '<p><center><table style="border-spacing:0">\n';
  html += '  <tr style="background-color:#4CAF50;color:white">\n';
  html += '    <th width=220 style="text-align:center">Key and/or Mouse Click</th> <th style="align:center">Action</th>\n';
  html += '  </tr>\n';
  html += '  <tr>\n';
  html += '    <td class="key">a</td> <td class="description">Show or hide all of the images that did not load in a multi-image window</td>\n';
  html += '  </tr>\n';
  html += '  <tr>\n';
  html += '    <td class="key">j</td> <td class="description">Next image</td>\n';
  html += '  </tr>\n';
  html += '  <tr>\n';
  html += '    <td class="key">J</td> <td class="description">Reduce the image scale by ' + image_resize_scale_delta + '%</td>\n';
  html += '  </tr>\n';
  html += '  <tr>\n';
  html += '    <td class="key">Right-Arrow</td> <td class="description">Next image</td>\n';
  html += '  <tr>\n';
  html += '  <tr>\n';
  html += '    <td class="key">Left-Mouse-Click</td> <td class="description">Next image (only for the clicked image)</td>\n';
  html += '  <tr>\n';
  html += '    <td class="key">h</td> <td class="description">This help message</td>\n';
  html += '  </tr>\n';
  html += '  <tr>\n';
  html += '    <td class="key">k</td> <td class="description">Previous image</td>\n';
  html += '  </tr>\n';
  html += '  <tr>\n';
  html += '    <td class="key">K</td> <td class="description">Increase the image scale by ' + image_resize_scale_delta + '%</td>\n';
  html += '  </tr>\n';
  html += '  <tr>\n';
  html += '    <td class="key">l</td> <td class="description">Link all of the single image windows together so that they all show the same image. Currently ' + link_single_image_windows + '.</td>\n';
  html += '  </tr>\n';
  html += '  <tr>\n';
  html += '    <td class="key">L</td> <td class="description">Link images together in all of the single image windows and the main image window so that they all show the same image. Currently ' + link_all_image_windows + '.</td>\n';
  html += '  </tr>\n';
  html += '  <tr>\n';
  html += '    <td class="key">Ctrl-Left-Mouse-Click</td> <td class="description">Previous image (only for the clicked image)</td>\n';
  html += '  <tr>\n';
  html += '    <td class="key">Left-Arrow</td> <td class="description">Previous image</td>\n';
  html += '  </tr>\n';
  html += '  <tr>\n';
  html += '    <td class="key">Shift-Left-Mouse-Click</td> <td class="description">Open a new window with the current image. Works in main image table and multi-image windows.</td>\n';
  html += '  <tr>\n';
  html += '  <tr>\n';
  html += '    <td class="key">Shift-Alt-Left-Mouse-Click</td> <td class="description">Open a new multi-image window with all of the images for the image selected</td>\n';
  html += '  <tr>\n';
  html += '  <tr>\n';
  html += '    <td class="key">p</td> <td class="description">Raise all of the single image windows.  This will bring them to the top in the order they were opened.</td>\n';
  html += '  </tr>\n';
  html += '  <tr>\n';
  html += '    <td class="key">q</td> <td class="description">Close the current help or single image window</td>\n';
  html += '  </tr>\n';
  html += '  <tr>\n';
  html += '    <td class="key">Q</td> <td class="description">Close all of the single image and help windows</td>\n';
  html += '  </tr>\n';
  html += '  <tr>\n';
  html += '    <td class="key">r</td> <td class="description">For the main table window,\n';
  html += '                  reset the images to have the original image size of ' + initial_size_in_percent + '%.\n';
  html += '                  For the single image windows, reset the size to 100%</td>\n';
  html += '  </tr>\n';
  html += '  <tr>\n';
  html += '    <td class="key">R</td> <td class="description">Link or unlink all of the single image windows resize events together.\n';
  html += '    Currently ' + link_single_image_windows_resize_events + ' with size ' + last_link_single_image_windows_resize_events_size + '%.</td>\n';
  html += '  </tr>\n';
  html += '  <tr>\n';
  html += '    <td class="key">t</td> <td class="description">Transpose the table</td>\n';
  html += '  </tr>\n';
  html += '  <tr>\n';
  html += '    <td class="key">u</td> <td class="description">Unhide all of the hidden rows and columns in the main image table</td>\n';
  html += '  </tr>\n';
  html += '  <tr>\n';
  html += '    <td class="key">Left-Click on row or column title</td> <td class="description">Hide all of the images in the given row or column</td>\n';
  html += '  </tr>\n';
  html += '  <tr>\n';
  html += '    <td style="position:relative;"><div style = "position: absolute; height:'+row_column_hidden_box_size_in_pixels+'; width:'+row_column_hidden_box_size_in_pixels+'; bottom:6px; right:0px; background-color:'+row_column_hidden_box_color+'; border:2px solid green;"></div></td>\n';
  html += '    <td class="description">Unhide all of the images in the next or previous row or column.  The '+row_column_hidden_box_color+' box is only present when a column or row is hidden.</td>\n';
  html += '  </tr>\n';
  html += '  <tr style="background-color:#4CAF50;color:white">\n';
  html += '    <th colspan="2" style="text-align:left">Multi-Image Window</th> <th style="align:center"></th>\n';
  html += '  </tr>\n';
  html += '  <tr>\n';
  html += '    <td class="key">Shift-Left-Mouse-Click</td> <td class="description">Open a new single image window with the current image. Works in main image table and multi-image windows.</td>\n';
  html += '  <tr>\n';
  html += '  <tr>\n';
  html += '    <td class="key">Left-Mouse-Click</td> <td class="description">Set the image in the main image table to the selected image by default.\n';
  html += '            If the "l" link single images option is active, then set the images in the single image windows to the selected image.\n';
  html += '            If the "L" link all images option is active, then set the images in the single image windows and the main image window to \n';
  html += '            the selected image.</td>\n';
  html += '  <tr>\n';

  html += '</table><center>\n';
  html += '</p>\n';

  var x_size_inner = 1200; // Inner window size.
  var y_size_inner = 900;
  var x_size_border=16, y_size_border=66;  // Informed guess at the size of the border around the inner window.
  var window_options = "width=" + x_size_inner;
  window_options += ", height=" + y_size_inner;
  window_options += ", menubar=no, status=no, titlebar=no, toolbar=no";  // These options don't appear to do anything.
  // Finally have the correct call after reading http://help.dottoro.com/ljuhanvh.php
  window_options = window_options.replace(/\s/g,"");
  // http://home.ubalt.edu/abento/js-tutor/part4/part4.htm said that the options should not have spaces.  From what
  // I can tell, spaces do not matter.
  // console.log("helpWindow: window_options = " + window_options);
  var help_window_name = "MiniWall HelpWindow" + help_window_count + Date();
  //var help_window = window.open("about:blank",help_window_name, window_options);
  var help_window = window.open("",help_window_name, window_options);
  help_windows[help_window_name] = help_window;
  help_window_count++;
  help_window.focus();

  // Place the new window in a nice location relative to the current main window.  This
  // unfortunately resizes the window so it nolonger is the specified size.  The new window
  // outter size is the same as the inner size of the original window.
  help_window.moveTo(window.screenX + 100, window.screenY + 200);
  // Informed guess on how much to change the window size by to get the desired size.
  help_window.resizeBy(x_size_border, y_size_border);
  // Use a Timeout to make sure the window is the size desired and log the changes.
  setTimeout(function(){
    var x_delta = x_size_inner-help_window.innerWidth;
    var y_delta = y_size_inner-help_window.innerHeight;
    console.log("helpWindow: resize deltas are " + x_delta + "x" + y_delta);
    help_window.resizeBy(x_size_inner-help_window.innerWidth, y_size_inner-help_window.innerHeight);
  },250);  // 150 ms should be plenty.  Use 250 ms to be sure.

  var doc = help_window.document;
  doc.open();
  doc.write(html);
  doc.close();
  doc.body.style.backgroundColor = "lightyellow";
  doc.body.style.margin = 0;  // Remove the 8px margin from the main page
  doc.title = "MiniWall Help";

  /*
   * I could not get this to work.
  // Add a listener for the "Q" key to close the help window.
  doc.keydown = function() {
        console.log("helpWindow.addEventListener: keydown = " + this.keyIdentifier);
        switch (this.keyIdentifier) {
          case "U+0051":  // Q key.
            help_window.close();
            break;
        }
      } ;
      */
  var help_color=0;
  help_window.document.addEventListener("keydown",
      function(event) {
        console.log("helpWindow.addEventListener: keydown = " + event.keyCode);
        switch (event.keyCode) {
          case 80:  // P key.
            raiseAllSingleImageWindows();
            break;
          case 81:  // Q key.
            if(event.shiftKey){
              closeAllSingleImageWindows();
              closeAllMultiImageWindows();
              closeAllHelpWindows();
            } else {
              help_window.close();
            }
            break;
          case 67:  // C key.  Change the background color.
            if ( help_color ) {
              help_window.document.body.style.backgroundColor = "green";
              help_color=0;
            } else {
              help_window.document.body.style.backgroundColor = "lightgreen";
              help_color=1;
            }
            break;
        }
      }
      );

  // Try using a pop up.
  if ( false ) {  // I could not get this to work.  I suspect that popups are blocked and am giving up 3/3/16
    var help_window_popup = help_window.createPopup();
    help_window_popup.innerHTML = html;
    help_window_popup.style.backgroundColor = "lightblue";
    help_window_popup.show(100,100,400,400, help_window);
  }
}

// Create style sheet rules for placing the unhide boxes in the correct place for the image table.
function createStyleSheetRules(){
    var sheet = document.createElement("style");
    var style_text = ".w3style {background-color: purple;border: 10px solid red;color:green;}\n";
    style_text += ".bigDiv {height:100px;width:200px;background-color: blue;border: 10px solid purple;position:relative;}\n";
    // Styles for drawing and locating the unhide boxes for the hidden rows and columns.
    style_text += ".bottomRight {height:"+row_column_hidden_box_size_in_pixels+";width:"+row_column_hidden_box_size_in_pixels
    style_text +=   ";background-color: "+row_column_hidden_box_color+";position:absolute;bottom:0;right:0;}\n";
    style_text += ".topRight    {height:"+row_column_hidden_box_size_in_pixels+";width:"+row_column_hidden_box_size_in_pixels
    style_text +=   ";background-color: "+row_column_hidden_box_color+";position:absolute;top:0;right:0;}\n";
    style_text += ".bottomLeft {height:"+row_column_hidden_box_size_in_pixels+";width:"+row_column_hidden_box_size_in_pixels
    style_text +=   ";background-color: "+row_column_hidden_box_color+";position:absolute;bottom:0;left:0;}\n";
    style_text += ".topLeft    {height:"+row_column_hidden_box_size_in_pixels+";width:"+row_column_hidden_box_size_in_pixels
    style_text +=   ";background-color: "+row_column_hidden_box_color+";position:absolute;top:0;left:0;}\n";
    // Styles for the hidden row and column titles.
    style_text += ".titleRowLeft    {position:relative; text-align:right;}\n";
    style_text += ".titleRowRight   {position:relative; text-align:left;}\n";
    style_text += ".titleColumnTop    {position:relative; text-align:center;}\n";
    style_text += ".titleColumnBottom {position:relative; text-align:center;}\n";
    // Styles for the selector controls and buttons below the image table.
    //style_text += ".selectorDiv {position:relative; display:inline-block; border:3px solid green;text-align:center}\n";
    style_text += ".selectorDiv {position:relative; display:inline-block; border:3px solid green;float:left;text-align:center}\n";
    style_text += ".selectorStyle {border:3px solid green;text-align:center}\n";
    //style_text += ".selectorStyle {border:3px solid green;float:bottom;text-align:center}\n";
    document.head.appendChild(sheet);
    sheet.appendChild(document.createTextNode(style_text));
}

// Print out to the console log all of the CSS rules.
function logSytleSheetRules(rules_document){
    var styleSheets = rules_document.styleSheets;
    console.log("logSytleSheetRules: The document " + rules_document + " has " + styleSheets.length + " rules"); 
    console.log(rules_document); 
    for ( var i_styleSheet=0; i_styleSheet < styleSheets.length; i_styleSheet++ ){
      var styleSheet = styleSheets[i_styleSheet];
      var rules = styleSheet.cssRules;
      console.log("logSytleSheetRules: StyleSheet " + i_styleSheet + " has " + rules.length + " rules"); 
      for ( var i_rule = 0; i_rule < rules.length; i_rule++) {
        var rule = rules[i_rule];
        console.log("logSytleSheetRules:      rule " + i_rule + " is named " + rule.selectorText + " with css: " + rule.cssText ); 
      }
    }
}

// Return the style object for the requested rule_name from the requested document.
// Example: var big_div_style = getCssRuleStyle(help_window.document, ".bigDiv");
function getCssRuleStyle(rules_document, rule_name){
    var styleSheets = rules_document.styleSheets;
    for ( var i_styleSheet=0; i_styleSheet < styleSheets.length; i_styleSheet++ ){
      var styleSheet = styleSheets[i_styleSheet];
      var rules = styleSheet.cssRules;
      for ( var i_rule = 0; i_rule < rules.length; i_rule++) {
        var rule = rules[i_rule];
        if ( rule.selectorText == rule_name ) {
          return rule.style;
        };
      }
    }
    return null;
}

// Go through all of the single image windows and set them to the same image index.
function setSingleImageWindowsToSameImage(image_index) {
  console.log("setSingleImageWindowsToSameImage: Setting all of the single image windows to have the given image.");
  for (var image_window_name in image_windows) {
    var image_window = image_windows[image_window_name];
    var image_element = image_windows_image[image_window_name];
    if (image_window.closed) {
      continue;
    }
    if (image_element.image_index != image_index) {
      setImageObject(image_element, image_index);
      setImageWindowTitle(image_element);
    }
  }
}

// Go through all of the single image windows and set them to the have the same size.
function resizeAllSingleImageWindows(scale_value_in_percent){
  console.log("resizeAllSingleImageWindows: Setting all of the single image windows to have the given image.");
  last_link_single_image_windows_resize_events_size = scale_value_in_percent;
  for (var image_window_name in image_windows) {
    var image_window = image_windows[image_window_name];
    var image_element = image_windows_image[image_window_name];
    if (image_window.closed) {
      continue;
    }
    console.log("resizeAllSingleImageWindows: " + image_element.root + " " + image_element.scale_value_in_percent + "%.");
    for (var image_window_name in image_windows) {
      if (image_element.scale_value_in_percent != scale_value_in_percent) {
        image_element.scale_value_in_percent = scale_value_in_percent;
        resizeSingleImageWindow(image_element, 0);
        setImageWindowTitle(image_element);
      }
    }
  }
}

// Raise all of the single image windows.
function raiseAllSingleImageWindows() {
  console.log("raiseAllSingleImageWindows: raising all of the single image windows.");
  for (var image_window_name in image_windows) {
    var image_window = image_windows[image_window_name];
    var image_element = image_windows_image[image_window_name];
    if (!image_window.closed) {
      image_window.focus();
      console.log("raiseAllSingleImageWindows: raising " + image_window_name);
    }
  }
}

// Close all of the single image windows.
function closeAllSingleImageWindows() {
  console.log("closeAllSingleImageWindows: Closing all of the single image windows.");
  for (var image_window_name in image_windows) {
    var image_window = image_windows[image_window_name];
    if (!image_window.closed) {
      image_window.close();
      console.log("closeAllSingleImageWindows: closing " + image_window_name);
    }
  }
}

// Close all of the multi-image windows.
function closeAllMultiImageWindows() {
  console.log("closeAllMultiImageWindows: Closing all of the multi-image windows.");
  for (var multi_image_window_name in multi_image_windows) {
    var multi_image_window = multi_image_windows[multi_image_window_name];
    if (!multi_image_window.closed) {
      multi_image_window.close();
      console.log("closeAllMultiImageWindows: closing " + multi_image_window_name);
    }
  }
}

// Close all of the help windows.
function closeAllHelpWindows() {
  console.log("closeAllHelpWindows: Closing all of the help windows.");
  for (var help_window_name in help_windows) {
    var help_window = help_windows[help_window_name];
    if (!help_window.closed) {
      help_window.close();
      console.log("closeAllHelpWindows: closing " + help_window_name);
    }
  }
}

// Change the style for the given main image table column and row titles.
function align_text_for_table_className(table_element,className,alignment){
  var class_list = table_element.getElementsByClassName(className);
  for ( var i = 0; i < class_list.length; i++) {
    class_list[i].style.textAlign = alignment;
  }
}

// Hide all of the TD elements in the given column.
function hideColumn(column_number, table_element){
  console.log("hideColumn:: hiding TD cells for column " + column_number);
  var num_rows = table_element.rows.length;
  var num_columns = table_element.rows[0].cells.length;
  if ( object_table_transposed ) {
    num_rows = table_element.rows[0].cells.length;
    num_columns = table_element.rows.length;
  }
  if ( column_number > 0 && column_number < (num_columns-1) ) {
    for ( var j = 0; j < num_rows; j++){
      var id = "table_data_i" + column_number + ":j" + j;
      var table_td_element = document.getElementById(id);
      table_td_element.style.display = "none";
      table_td_element.hiddenColumn=true;
    }
    if ( column_number > 1 ) { 
      document.getElementById("top_next_column_" + (column_number-1)).style.display = "";
      document.getElementById("bottom_next_column_" + (column_number-1)).style.display = "";
    }
    if ( column_number < num_columns-2 ) { 
      document.getElementById("top_previous_column_" + (column_number+1)).style.display = "";
      document.getElementById("bottom_previous_column_" + (column_number+1)).style.display = "";
    }
  }
}

// Hide all of the TD elements in the given row.
function hideRow(row_number, table_element){
  console.log("hideRow:: hiding TD cells for row " + row_number);
  var num_rows = table_element.rows.length;
  var num_columns = table_element.rows[0].cells.length;
  if ( object_table_transposed ) {
    num_rows = table_element.rows[0].cells.length;
    num_columns = table_element.rows.length;
  }
  if ( row_number > 0 && row_number < num_rows ) {
    for ( var i = 0; i < num_columns; i++){
      var id = "table_data_i" + i + ":j" + row_number;
      console.log("hideRow:: hiding cell with id " + id);
      var table_td_element = document.getElementById(id);
      table_td_element.style.display = "none";
      table_td_element.hiddenRow=true;
    }
    if ( row_number > 1 ) { 
      document.getElementById("left_side_next_row_" + (row_number-1)).style.display = "";
      document.getElementById("right_side_next_row_" + (row_number-1)).style.display = "";
    }
    if ( row_number < num_rows-2 ) { 
      document.getElementById("left_side_previous_row_" + (row_number+1)).style.display = "";
      document.getElementById("right_side_previous_row_" + (row_number+1)).style.display = "";
    }
  }
}

// Unhide all of the TD elements in a column in the main image table.
function unhideColumn(table_element, column_number){
  console.log("unhideAllRowsAndColumns:: unhiding cells in column " + column_number);
  var num_rows = table_element.rows.length;
  var num_columns = table_element.rows[0].cells.length;
  if ( object_table_transposed ) {
    num_rows = table_element.rows[0].cells.length;
    num_columns = table_element.rows.length;
  }
  for ( var j = 0; j < num_rows; j++){
    var id = "table_data_i" + column_number + ":j" + j;
    console.log("unhideAllRowsAndColumns:: unhiding cell with id " + id);
    var table_td_element = document.getElementById(id);
    table_td_element.hiddenColumn=false;
    if ( !table_td_element.hiddenRow ) { table_td_element.style.display = ""; }
  }
  if ( column_number > 1 ) { 
    document.getElementById("top_next_column_" + (column_number-1)).style.display = "none";
    document.getElementById("bottom_next_column_" + (column_number-1)).style.display = "none";
  }
  if ( column_number < num_columns-2 ) { 
    document.getElementById("top_previous_column_" + (column_number+1)).style.display = "none";
    document.getElementById("bottom_previous_column_" + (column_number+1)).style.display = "none";
  }
}

// Unhide all of the TD elements in a row in the main image table.
function unhideRow(table_element, row_number){
  console.log("unhideAllRowsAndColumns:: unhiding cells in row " + row_number);
  var num_rows = table_element.rows.length;
  var num_columns = table_element.rows[0].cells.length;
  if ( object_table_transposed ) {
    num_rows = table_element.rows[0].cells.length;
    num_columns = table_element.rows.length;
  }
  for ( var i = 0; i < num_columns; i++){
    var id = "table_data_i" + i + ":j" + row_number;
    console.log("unhideAllRowsAndColumns:: unhiding cell with id " + id);
    var table_td_element = document.getElementById(id);
    table_td_element.hiddenRow=false;
    if ( !table_td_element.hiddenColumn ) { table_td_element.style.display = ""; }
  }
  if ( row_number > 1 ) { 
    document.getElementById("left_side_next_row_" + (row_number-1)).style.display = "none";
    document.getElementById("right_side_next_row_" + (row_number-1)).style.display = "none";
  }
  if ( row_number < num_rows-2 ) { 
    document.getElementById("left_side_previous_row_" + (row_number+1)).style.display = "none";
    document.getElementById("right_side_previous_row_" + (row_number+1)).style.display = "none";
  }
}

// Unhide all of the TD elements in the main image table.
function unhideAllRowsAndColumns(table_element){
  console.log("unhideAllRowsAndColumns:: unhiding all TD cells");
  var num_rows = table_element.rows.length;
  var num_columns = table_element.rows[0].cells.length;
  if ( object_table_transposed ) {
    num_rows = table_element.rows[0].cells.length;
    num_columns = table_element.rows.length;
  }
  for ( var j = 0; j < num_rows; j++){
    for ( var i = 0; i < num_columns; i++){
      var id = "table_data_i" + i + ":j" + j;
      console.log("unhideAllRowsAndColumns:: unhiding cell with id " + id);
      var table_td_element = document.getElementById(id);
      table_td_element.style.display = "";
      table_td_element.hiddenColumn=false;
      table_td_element.hiddenRow=false;
    }
  }
  for ( row_number = 1; row_number < num_rows-1; row_number++){
    document.getElementById("left_side_next_row_" + row_number).style.display = "none";
    document.getElementById("right_side_next_row_" + row_number).style.display = "none";
    document.getElementById("left_side_previous_row_" + row_number).style.display = "none";
    document.getElementById("right_side_previous_row_" + row_number).style.display = "none";
  }
  for ( column_number = 1; column_number < num_columns-1; column_number++){
    document.getElementById("top_next_column_" + column_number).style.display = "none";
    document.getElementById("bottom_next_column_" + column_number).style.display = "none";
    document.getElementById("top_previous_column_" + column_number).style.display = "none";
    document.getElementById("bottom_previous_column_" + column_number).style.display = "none";
  }
}

// Create an object that contains the main image table.
function create_image_table_object(size_in_percent) {
  object_table_transposed = 0;
  initial_size_in_percent = size_in_percent;
  var alt_name="";
  var content="";
  var table_id="image_table_from_objects";
  var width = image_width*size_in_percent/100.0;
  var height = image_height*size_in_percent/100.0;
  var current_image=selected_image;

  // Create column labels for the top and bottom of the image table
  var column_titles = [];
  column_titles.push("");
  for ( var j = 0; j < column_values.length; j++ ) {
    column_titles.push(column_label_prefix + "&nbsp;" + column_values[j]);
  }
  column_titles.push("");
  console.log("Column Titles = " + column_titles);

  // Create a filtered list of row_data_sets.  Use the selected configuration
  // to do the filtering.
  var row_data_sets_filtered = [];
  console.log("# Filter the simulation data sets by the 'Configuration' and 'Mach Number'");
  console.log("#   to select the subset desired for viewing.");
  for ( var i = 0; i < row_data_sets.length; i++ ) {
    var row_data_set = row_data_sets[i];
    if ( has_configurations ) { 
      var selected_configuration = configurations[selected_configuration_index];
      if ( selected_configuration == "All" || row_data_set.search(selected_configuration) >= 0 ) {
        console.log("# data set '" + row_data_set + "' matches configuration test on '" + selected_configuration + "'");
      } else {
        console.log("# data set '" + row_data_set + "' fails configuration test on '" + selected_configuration + "'");
        continue;
      }
    }
    if ( has_mach_numbers ) { 
      var selected_mach_number = mach_numbers[selected_mach_number_index];
      if ( selected_mach_number == "All" || row_data_set.search("Mach" + selected_mach_number) >= 0 ) {
        console.log("# data set '" + row_data_set + "' matches mach_number test on '" + selected_mach_number + "'");
      } else {
        console.log("# data set '" + row_data_set + "' fails mach_number test on '" + selected_mach_number + "'");
        continue;
      }
    }
    console.log("# data set '" + row_data_set + "' added to main image table simulation list");
    row_data_sets_filtered.push(row_data_set);
  }
  // Create row labels for the left and right of the image table.
  var row_titles = [];
  for ( var i = 0; i < row_data_sets_filtered.length; i++ ) {
    row_titles.push(row_data_sets_filtered[i].replace(/:/g,"<br>").replace(/_Mesh/,"<br>Mesh").replace(/_Poly/,"<br>Poly").replace(/_Coupled/,"<br>Coupled"));
    // Customize the title a bit more if the MiniWall is for the venting project.
    if ( miniwall_type  == "venting" ) {
      row_titles[i] = row_titles[i].replace(/_/g,"<br>").replace(/hw4.5/,"-<br>&nbsp;&nbsp;hw4.5");
    }
  }
  console.log("Row Titles = " + row_titles);

  var table_element = document.getElementById(table_id);
  if ( !table_element ) {
    table_element = document.createElement("TABLE");
    table_element.id=table_id;
    // Change the table properties so that the text is more visible.
    table_element.style.color = "pink";
    table_element.style.textAlign = "center";
    table_element.style.backgroundColor = "yellow";
    table_element.style.backgroundColor = "green";
    console.log("#createTableOfObjects:: Adding '" + table_id + "' table");
  } else {
    //alert('#createTableOfObjects:: Existing image table found when expecting to create a new one.');
    console.log("#createTableOfObjects:: Found existing '" + table_id + "' table");
    console.log("#createTableOfObjects:: Removing all rows to get a clean start.");
    var count=0;
    while ( table_element.hasChildNodes() ) {
      console.log("    (" + count++ + ") " + table_element.firstChild);
      table_element.removeChild(table_element.firstChild);
    }
  }

  // Add column titles to the top of the table.
  var table_row = document.createElement("TR");
  table_row.id="image_row_0";
  table_element.appendChild(table_row);
  for ( var i = 0; i < column_titles.length; i++ ) {
    var table_td_loop = document.createElement("TD");
    table_td_loop.id = "table_data_i" + i + ":j" + 0;
    table_td_loop.columnNumber = i;
    table_td_loop.innerHTML = column_titles[i];
    table_td_loop.classList.add("titleColumnTop");
    table_td_loop.hiddenColumn=false;
    table_td_loop.hiddenRow=false;
    table_td_loop.onclick = function(event) {
      console.log("TD id is: " + this.id + " with parent id " +  this.parentNode.id + " and column " + this.columnNumber);
      console.log("TD id is: " + this.id + " click target is " + event.target);
      if ( event.target.tagName == "TD" ) {
        hideColumn(this.columnNumber, table_element);
        this.style.display = "none";
      }
    };

    if ( i > 0 && i < column_titles.length-1 ) {
      // Add small divs to the bottom corners of the TD element to unhide hidden columns.
      var unhide_next_column_div = document.createElement("div");
      unhide_next_column_div.id = "top_next_column_" + i;
      unhide_next_column_div.classList.add("bottomRight");
      unhide_next_column_div.style.display = "none";
      unhide_next_column_div.title = "Unhide next column or row";
      unhide_next_column_div.onclick = function(event) { unhideColumn(table_element, Number(this.parentNode.columnNumber)+1); };
      table_td_loop.appendChild(unhide_next_column_div);

      var unhide_previous_column_div = document.createElement("div");
      unhide_previous_column_div.id = "top_previous_column_" + i;
      unhide_previous_column_div.classList.add("bottomLeft");
      unhide_previous_column_div.style.display = "none";
      unhide_previous_column_div.title = "Unhide previous column or row";
      unhide_previous_column_div.onclick = function(event) { unhideColumn(table_element, Number(this.parentNode.columnNumber)-1); };
      table_td_loop.appendChild(unhide_previous_column_div);
    }

    table_row.appendChild(table_td_loop);
  }
  // Create the main data rows of the table
  for ( var j = 0; j < row_titles.length; j++ ) {
    var table_row = document.createElement("TR");
    table_row.id="image_row_" + (j+1);
    table_element.appendChild(table_row);
    // Add the row title to the first column.
    var table_td_loop = document.createElement("TD");
    table_td_loop.innerHTML = row_titles[j];
    table_td_loop.text = row_titles[j];
    // Adjust j so that the table data elements are consistantly numbered with 0,0 being the top left.
    table_td_loop.id = "table_data_i" + 0 + ":j" + (j+1);
    table_td_loop.rowNumber = j+1;
    table_td_loop.hiddenColumn=false;
    table_td_loop.hiddenRow=false;
    table_td_loop.classList.add("titleRowLeft");
    table_td_loop.onclick = function(event) {
      //console.log("TD id is: " + this.id + " with parent id " +  this.parentNode.id); this.parentNode.style.display = "none";
      if ( event.target.tagName == "TD" ) {
        hideRow(this.rowNumber, table_element);
        this.style.display = "none";
      }
    };
    //table_td_loop.onclick = function() {console.log("TD id is: " + table_td_loop.id)};

    // Add small divs to the right corners of the TD element to unhide hidden rows.
    var unhide_next_row_div = document.createElement("div");
    unhide_next_row_div.id = "left_side_next_row_" + (j+1);
    unhide_next_row_div.classList.add("bottomRight");
    unhide_next_row_div.style.display = "none";
    unhide_next_row_div.title = "Unhide next column or row";
    unhide_next_row_div.onclick = function(event) { unhideRow(table_element, Number(this.parentNode.rowNumber)+1); };
    table_td_loop.appendChild(unhide_next_row_div);

    var unhide_previous_row_div = document.createElement("div");
    unhide_previous_row_div.id = "left_side_previous_row_" + (j+1);
    unhide_previous_row_div.classList.add("topRight");
    unhide_previous_row_div.style.display = "none";
    unhide_previous_row_div.title = "Unhide previous column or row";
    unhide_previous_row_div.onclick = function(event) { unhideRow(table_element, Number(this.parentNode.rowNumber)-1); };
    table_td_loop.appendChild(unhide_previous_row_div);
    table_row.appendChild(table_td_loop);
    var root;

    // Add the images for each cell in the body of the table.
    //
    // setup the base parts of the name from the row_data_sets array.
    var row_data_set = row_data_sets_filtered[j];
    var configName = row_data_set.split(":")[0];
    var machName = row_data_set.split(":")[1];
    var beta = row_data_set.split(":")[2];
    var meshAndFlowRatesName = row_data_set.split(":")[3];
    // For a few simulations, there is not a full set of data with the same run values so use ones close to the desired ones.
    var pat = /A-4.6.4:Mach0.2026:Beta0:Base1450_Mesh10.15_Poly/;
    if ( pat.test(row_data_set) && row_data_sets_filtered[j] == "0" ) {
      meshAndFlowRatesName = "Base1400_Mesh10.15_Poly";
    }
    pat = /A-4.6.5:Mach0.2026:Beta0:Base1500_Mesh10.15_Poly_wrongAALoc/;
    if ( pat.test(row_data_set) && row_data_sets_filtered[j] == "0" ) {
      meshAndFlowRatesName = "Base1500_Mesh10.15_Poly";
    }
    for ( var i = 0; i < column_values.length; i++ ) {
      // concatenate to create the image filename
      root = configuration_basename + "_" + configName + "_" + machName + "_Alt0_" ;
      root+= column_label_prefix + column_values[i] + "_" + beta + "_" + meshAndFlowRatesName + "_";
      // Get the base name of the image from the column and row names.
      root = get_image_root_name_from_cell_column_and_row_names(configuration_basename, 
        column_label_prefix, column_values[i], row_data_sets_filtered[j]);

      var img_id = "image" + j + ":" + i;
      var img_node = document.getElementById(img_id);
      if ( img_node ) {
        var table_td_loop = document.createElement("TD");
        table_td_loop.id = "table_data_i" + i + ":j" + j;
        table_td_loop.appendChild(img_node);
        table_row.appendChild(table_td_loop);
        console.log("create_image_table_object: found " + table_td_loop.id);
      } else {
        var table_td_loop = document.createElement("TD");
        var table_td_div  = document.createElement("div");
        // Adjust i and j so that the table data elements are consistantly numbered with 0,0 in the upper left.
        table_td_loop.id = "table_data_i" + (i+1) + ":j" + (j+1);
        var strImage = root + selected_image + image_filename_extension;
        alt_name = strImage;
        //strImage="./images/"+strImage;
        strImage= image_directory_path+strImage;
        var image_element = document.createElement("IMG");
        image_element.id = img_id;

        image_element.root = root;
        image_element.title = current_image;
        image_element.alt = selected_image;
        image_element.src = strImage;
        image_element.image_index = selected_image_index;
        image_element.width = width;
        image_element.height = height;
        image_element.style.backgroundColor = "red";
        image_element.style.color = "pink";
        image_element.className="Image";
        image_element.onclick = function(event) {clickImageObject(event, this.id, table_element)};
        table_td_div.appendChild(image_element);
        table_td_loop.appendChild(table_td_div);
        table_td_loop.hiddenColumn=false;
        table_td_loop.hiddenRow=false;
        table_row.appendChild(table_td_loop);
        console.log("create_image_table_object: did not find " + table_td_loop.id + ' using string name ' + strImage + ' so createElement was used to create it.');
      }
    }
    // Add the row title to the last column.
    var table_td_loop = document.createElement("TD");
    // Adjust i and j so that the table data elements are consistantly numbered with 0,0 being the top left.
    table_td_loop.id = "table_data_i" + (i+1) + ":j" + (j+1);
    table_td_loop.innerHTML = row_titles[j];
    table_td_loop.rowNumber = j+1;
    table_td_loop.text = row_titles[j];
    table_td_loop.title = row_titles[j];
    table_td_loop.hiddenColumn=false;
    table_td_loop.hiddenRow=false;
    table_td_loop.classList.add("titleRowRight");
    table_td_loop.onclick = function() {
      if ( event.target.tagName == "TD" ) {
        hideRow(this.rowNumber, table_element);
        this.style.display = "none";
      }
    };

    // Add small divs to the left corners of the TD element to unhide hidden rows.
    var unhide_next_row_div = document.createElement("div");
    unhide_next_row_div.id = "right_side_next_row_" + (j+1);
    unhide_next_row_div.classList.add("bottomLeft");
    unhide_next_row_div.style.display = "none";
    unhide_next_row_div.title = "Unhide next column or row";
    unhide_next_row_div.onclick = function(event) { unhideRow(table_element, Number(this.parentNode.rowNumber)+1); };
    table_td_loop.appendChild(unhide_next_row_div);

    var unhide_previous_row_div = document.createElement("div");
    unhide_previous_row_div.id = "right_side_previous_row_" + (j+1);
    unhide_previous_row_div.classList.add("topLeft");
    unhide_previous_row_div.style.display = "none";
    unhide_previous_row_div.title = "Unhide previous column or row";
    unhide_previous_row_div.onclick = function(event) { unhideRow(table_element, Number(this.parentNode.rowNumber)-1); };
    table_td_loop.appendChild(unhide_previous_row_div);
    table_row.appendChild(table_td_loop);
  }
  // Add column titles to the bottom of the table.
  var table_row = document.createElement("TR");
  table_row.id="image_row_" + (j+1);
  table_element.appendChild(table_row);
  for ( var i = 0; i < column_titles.length; i++ ) {
    var table_td_loop = document.createElement("TD");
    table_td_loop.id = "table_data_i" + i + ":j" + (j+1);
    table_td_loop.columnNumber = i;
    table_td_loop.innerHTML = column_titles[i];
    table_td_loop.classList.add("titleColumnBottom");
    table_td_loop.hiddenColumn=false;
    table_td_loop.hiddenRow=false;
    table_td_loop.onclick = function(event) {
      console.log("TD id is: " + this.id + " with parent id " +  this.parentNode.id + " and column " + this.columnNumber);
      console.log("TD id is: " + this.id + " click target is " + event.target);
      if ( event.target.tagName == "TD" ) {
        hideColumn(this.columnNumber, table_element);
        this.style.display = "none";
      }
    };

    if ( i > 0 && i < column_titles.length-1 ) {
      // Add small divs to the top corners of the TD element to unhide hidden columns.
      var unhide_next_column_div = document.createElement("div");
      unhide_next_column_div.id = "bottom_next_column_" + i;
      unhide_next_column_div.classList.add("topRight");
      unhide_next_column_div.style.display = "none";
      unhide_next_column_div.title = "Unhide next column or row";
      unhide_next_column_div.onclick = function(event) { unhideColumn(table_element, Number(this.parentNode.columnNumber)+1); };
      table_td_loop.appendChild(unhide_next_column_div);

      var unhide_previous_column_div = document.createElement("div");
      unhide_previous_column_div.id = "bottom_previous_column_" + i;
      unhide_previous_column_div.classList.add("topLeft");
      unhide_previous_column_div.style.display = "none";
      unhide_previous_column_div.title = "Unhide previous column or row";
      unhide_previous_column_div.onclick = function(event) { unhideColumn(table_element, Number(this.parentNode.columnNumber)-1); };
      table_td_loop.appendChild(unhide_previous_column_div);
    }

    table_row.appendChild(table_td_loop);
  }
  return table_element;
}
