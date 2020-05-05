/*
 * Michael Schuh
 * NASA Ames Research Center Code AA
 * Moffett Field, CA 94035
 *
 * MiniWall Software
 * 2020-04-30 Version 3.1 Release for NASA GitHub site.
 * 2016-04-14 Version 2.1 Inspired by the MiniWall created by John Melton in 2006 and reworked by Paul Stremel
 *
 */

//  MiniWall setup parameters

// Set the rows in the MiniWall
var row_data_sets = [];
//  Mach 0.9
row_data_sets.push("Sqr7.2ha45pt1hw4.5hs0.1875:Mach0.9:Pte77136:Tte320:Trat0.85:BLVer0.9-Aa:Base4.0:Mesh2.20:c:7 inch, Mach 0.9");
row_data_sets.push("Sqr5.091ha45pt1hw4.5hs0.1875:Mach0.9:Pte77136:Tte320:Trat0.85:BLVer0.9-Aa:Base4.0:Mesh2.20:c:5 inch, Mach 0.9");
row_data_sets.push("Sqr3.6ha45pt1hw4.5hs0.1875:Mach0.9:Pte77136:Tte320:Trat0.85:BLVer0.9-Aa:Base4.0:Mesh2.20:c:3 inch, Mach 0.9");
//  Mach 1.4
row_data_sets.push("Sqr7.2ha45pt1hw4.5hs0.1875:Mach1.4:Pte73711:Tte320:Trat0.85:BLVer1.4-Aa:Base4.0:Mesh2.20:c:7 inch, Mach 1.4");
row_data_sets.push("Sqr5.091ha45pt1hw4.5hs0.1875:Mach1.4:Pte73711:Tte320:Trat0.85:BLVer1.4-Aa:Base4.0:Mesh2.20:c:5 inch, Mach 1.4");
row_data_sets.push("Sqr3.6ha45pt1hw4.5hs0.1875:Mach1.4:Pte73711:Tte320:Trat0.85:BLVer1.4-Aa:Base4.0:Mesh2.20:c:3 inch, Mach 1.4");

// Set the column values in the MiniWall
var column_values = [];
column_values.push("1.02");
column_values.push("1.05");
column_values.push("1.10");
column_values.push("1.20");
column_values.push("1.40");
column_values.push("1.60");
column_values.push("1.80");

var configuration_basename="FML";    // configuration name
var column_label_prefix="Prat";      // x-axis label (A for AoA, etc. )
var image_filename_extension="png";  // Image type.  Use jpg or whatever format your images are in here.

// This is a list of the image for each cell in the MiniWall.  Not all cells have to have a full set of images.
var image_extension_names ="\
Solution_Mach_closeUpRight \
Solution_Mach_closeUpTop \
Solution_Mach_closeUpTopRight \
Solution_Mach_closeUpTopRightMesh \
Solution_Mach_Big \
Solution_Mach_BigMesh \
Solution_Temperature_closeUp \
Solution_Temperature_Big \
Solution_PressureSurface \
Solution_PressureSurface_closeUp \
Solution_PressureSurface_Big \
Solution_PressureSurface_BigMesh \
Solution_PressureSurface_Medium \
Solution_PressureSurface_MediumWithSeparationBubble \
Solution_PressureSurface_MediumWithSeparationBubbleInclined1 \
Solution_PressureSurface_MediumWithSeparationBubbleInclined2 \
Solution_PressureSurface_MediumWithSeparationBubbleInclined3 \
Solution_PressureSurface_MediumWithSeparationBubbleInclined4 \
Solution_PressureRatio_closeUp \
Solution_PressureRatio_Big \
Solution_Pressure_closeUp \
Solution_Pressure_Big \
Solution_MachFlowTube_At-0.010pt \
Solution_MachFlowTube_At-0.010pt_closeUpLE \
Solution_MachFlowTube_At-0.010pt_closeUpLEMesh \
Solution_MachFlowTube_At-0.010pt_closeUpTE \
Solution_MachFlowTube_At-0.500pt \
Solution_MachFlowTube_At-0.500pt_closeUpLE \
Solution_MachFlowTube_At-0.500pt_closeUpLEMesh \
Solution_MachFlowTube_At-0.500pt_closeUpTE \
Solution_MachFlowTube_At-0.990pt \
Solution_MachFlowTube_At-0.990pt_closeUpLE \
Solution_MachFlowTube_At-0.990pt_closeUpLEMesh \
Solution_MachFlowTube_At-0.990pt_closeUpTE \
Solution_MachFlowTube_At-1.010pt \
Solution_MachFlowTube_At-1.010pt_closeUpLE \
Solution_MachFlowTube_At-1.010pt_closeUpLEMesh \
Solution_MachFlowTube_At-1.010pt_closeUpTE \
Solution_MachFlowTube_At+0.010pt \
Solution_MachFlowTube_At+0.010pt_closeUpLE \
Solution_MachFlowTube_At+0.010pt_closeUpLEMesh \
Solution_MachFlowTube_At+0.010pt_closeUpTE \
Solution_VelocityFlowTube_closeUpTop \
Solution_VelocityFlowTubeAt-0.010pt \
Solution_VelocityFlowTubeAt-0.010pt_closeUpLE \
Solution_VelocityFlowTubeAt-0.010pt_closeUpLEMesh \
Solution_VelocityFlowTubeAt-0.010pt_closeUpTE \
Solution_VelocityFlowTubeAt-0.500pt \
Solution_VelocityFlowTubeAt-0.500pt_closeUpLE \
Solution_VelocityFlowTubeAt-0.500pt_closeUpLEMesh \
Solution_VelocityFlowTubeAt-0.500pt_closeUpTE \
Solution_VelocityFlowTubeAt-0.990pt \
Solution_VelocityFlowTubeAt-0.990pt_closeUpLE \
Solution_VelocityFlowTubeAt-0.990pt_closeUpLEMesh \
Solution_VelocityFlowTubeAt-0.990pt_closeUpTE \
Solution_VelocityFlowTubeAt-1.010pt \
Solution_VelocityFlowTubeAt-1.010pt_closeUpLE \
Solution_VelocityFlowTubeAt-1.010pt_closeUpLEMesh \
Solution_VelocityFlowTubeAt-1.010pt_closeUpTE \
Solution_VelocityFlowTubeAt+0.010pt \
Solution_VelocityFlowTubeAt+0.010pt_closeUpLE \
Solution_VelocityFlowTubeAt+0.010pt_closeUpLEMesh \
Solution_VelocityFlowTubeAt+0.010pt_closeUpTE \
Solution_VelocityFlowTube_closeUpTopFwdReverseFlowTubeDirection \
Solution_VelocityFlowTubeFwdReverseFlow_At-0.010pt \
Solution_VelocityFlowTubeFwdReverseFlow_At-0.010pt_closeUpLE \
Solution_VelocityFlowTubeFwdReverseFlow_At-0.010pt_closeUpTE \
Solution_VelocityFlowTubeFwdReverseFlow_At-0.500pt \
Solution_VelocityFlowTubeFwdReverseFlow_At-0.500pt_closeUpLE \
Solution_VelocityFlowTubeFwdReverseFlow_At-0.500pt_closeUpTE \
Solution_VelocityFlowTubeFwdReverseFlow_At-0.990pt \
Solution_VelocityFlowTubeFwdReverseFlow_At-0.990pt_closeUpLE \
Solution_VelocityFlowTubeFwdReverseFlow_At-0.990pt_closeUpTE \
Solution_Temperature_closeUp \
Solution_TemperatureFlowTubeAt+0.010pt \
Solution_TemperatureFlowTubeAt-0.010pt \
Solution_TemperatureFlowTubeAt-0.500pt \
Solution_TemperatureFlowTubeAt-0.990pt \
Solution_TemperatureFlowTubeAt-1.010pt \
Solution_Pressure_closeUp \
Solution_PressureFlowTubeAt+0.010pt \
Solution_PressureFlowTubeAt-0.010pt \
Solution_PressureFlowTubeAt-0.500pt \
Solution_PressureFlowTubeAt-0.990pt \
Solution_PressureFlowTubeAt-1.010pt \
Solution_VelocityConvolutionIntegral_closeUpTop \
Solution_VelocityConvolutionIntegral_closeUpRight \
Solution_VelocityConvolutionIntegral_closeEntranceTE \
plotResiduals \
plotMassFlux \
Mesh \
Mesh_closeUp \
Mesh_closeUp2 \
Mesh_closeUp3 \
Mesh_closeUp4 \
Mesh_closeUp5 \
Mesh_closeUpWider \
";

// Options for the "Configurations" drop down selector
// You can be creative with these values and use a regular expression.
// Matches are performed using the string.search() method.  https://www.w3schools.com/jsref/jsref_search.asp
var configurations = new Array();
configurations.push("All");
configurations.push("Sqr3.6");
configurations.push("Sqr5.0");
configurations.push("Sqr7.2");

// Options for the "Mach Number" drop down selector
// You can be creative with these values and use a regular expression.
// Matches are performed using the string.search() method.  https://www.w3schools.com/jsref/jsref_search.asp
var mach_numbers = new Array();
mach_numbers.push("All");
mach_numbers.push("0.9");
mach_numbers.push("1.4");
