#!/u/mschuh/local/bin/ruby

debug = false

images = Dir.glob("FML_Sqr5.091ha45pt1hw4.5hs0.1875_Mach1.4_Pte73711_Tte320_Trat0.85_Prat1.10_BLVer1.4-Aa_Base4.0_Mesh2.20_Poly_c*")
images.map!{ |sim| sim.gsub(/FML_Sqr5.091ha45pt1hw4.5hs0.1875_Mach1.4_Pte73711_Tte320_Trat0.85_Prat1.10_BLVer1.4-Aa_Base4.0_Mesh2.20_Poly_c/,"") }
#puts images.inspect

images_mesh = Dir.glob("FML_Sqr3.6ha45pt1hw4.5hs0.1875_Mach0.9_Pte77136_Tte320_Trat0.85_Prat1.20_BLVer0.9-Aa_Base4.0_Mesh2.20_Poly_c*")
images_mesh.map!{ |sim| sim.gsub(/FML_Sqr3.6ha45pt1hw4.5hs0.1875_Mach0.9_Pte77136_Tte320_Trat0.85_Prat1.20_BLVer0.9-Aa_Base4.0_Mesh2.20_Poly_c/,"") }

sims = Dir.glob("*Solution_Mach_BigMesh.png")
sims.map!{ |sim| sim.sub(/_Solution_Mach_BigMesh.png/,"") }
sims.each{ |sim| 
  num_image_files = Dir.glob("#{sim}*").size 
  # puts sim,Dir.glob("#{sim}*").size 
  i = 0

  # This lists all of the images for a simulation.  This is not what we want.
  # Check to see if there are extra images.
  if ( true ) then
  Dir.glob(sim+"*").each { |image|
    i = i + 1
    #puts "#{image} #{File.exists?(image)}   Extension #{image.gsub(sim,"")}"
    if (! images_mesh.include?(image.gsub(sim,"")) ) then 
      puts "   Extra Image: #{image}"
    end
  }
  puts i
  end

  # Go through all of the image extensions and see if they exist.
  missing_image_count = 0
  images.each { |image_name|
    image = sim + image_name
    if (! File.exists?(image) ) then
      puts "   Missing: #{image}"
      missing_image_count = 1 + missing_image_count
    end
  }
   
  puts "# sim #{sim}  has #{num_image_files} images and #{missing_image_count} missing images."
}

exit

if ( ARGV.length == 2 ) then
   mini_wall_setup_file = ARGV[0]
   image_list = ARGV[1]
   puts "\nProcessing MiniWall configuration file #{mini_wall_setup_file}" if debug
   puts "Image list file: #{image_list}\n" if debug
   images = File.open(image_list, "r").readlines.map! { |img_name| img_name.chomp.sub(/.png$/,"") }
   puts "Images #{images.inspect}" if debug
   File.open(mini_wall_setup_file , "r") do |f|
     f.each_line do |line|
       puts line
       # Look for line 'var image_extension_names ="\'
       if line.match(/var image_extension_names =/) then
         puts "Found host in line #{line}" if debug
         break
       end
     end

     # Read until the end of the image list.
     f.each_line do |line|
       if line.match(/\"/) then
         puts "Found end of image list #{line}" if debug
         puts line
         break
       else
         img_name = line.chomp.split[0]
         puts "Image line: #{line.chomp} img_name = #{img_name} exists_in_img_list? #{images.include?(img_name)}" if debug
         puts line if images.include?(img_name)
       end
     end
     f.each_line do |line|
       puts line
     end
   end
else
   puts "
# USAGE: miniWall_prune_image_list.rb minWall_setup.js /tmp/ext
#
# Description: figures out which image names are not in the given list of files (/tmp/ext).
#              /tmp/ext looks like this and comes from editing 'ls -1' output.
#                  Mesh.png
#                  Mesh_closeUp.png
"
end
