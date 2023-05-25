import os
import json
import argparse


def generate_file_list(directory, output_file):
    file_list = []
    for root, _, files in os.walk(directory):
        for file in files:
            file_path = os.path.join(root, file)
            file_list.append(file_path)

    with open(output_file, 'w') as file:
        json.dump(file_list, file, indent=4)


# Parse command-line arguments
parser = argparse.ArgumentParser(description='Generate a JSON file with file paths in a directory.')
parser.add_argument('-i', '--input', help='The directory to scan for files.')
parser.add_argument('-o', '--output', help='The output JSON file to write the file paths to.')
args = parser.parse_args()

# Generate the file list
generate_file_list(args.input, args.output)
